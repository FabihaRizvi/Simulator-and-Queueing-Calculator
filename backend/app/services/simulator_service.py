import math
import heapq
import random
from typing import List, Tuple, Optional

from backend.app.models.simulator_models import (
    SimulationParams, PrioritySimulationParams,
    SimulationResult, SimulationResponse, GanttBar,
    QueueCalcParams, QueueCalcResponse
)

def _build_response(completed: List[SimulationResult], num_servers: int) -> SimulationResponse:
    avg_wait = sum(c.wait_time for c in completed) / len(completed) if completed else 0.0
    avg_rt   = sum(c.response_time for c in completed) / len(completed) if completed else 0.0
    avg_tat  = sum(c.turnaround_time for c in completed) / len(completed) if completed else 0.0
    total_time = max((c.end_time for c in completed), default=0.0)
    busy_time = sum(c.service_time for c in completed)
    utilization = (busy_time / (num_servers * total_time)) if total_time > 0 else 0.0

    gantt = [GanttBar(server_id=c.server_id, customer_id=c.customer_id,
                      start_time=c.start_time, end_time=c.end_time)
             for c in completed]

    return SimulationResponse(
        results=completed,
        average_wait_time=avg_wait,
        average_turnaround_time=avg_tat,
        average_response_time=avg_rt,
        server_utilization=utilization,
        gantt=gantt
    )

def _generate_customers(n: int, arrival_mean: float, service_mean: float,
                        priorities: Optional[List[int]] = None,
                        max_priority: int = 0):
    customers = []
    t = 0.0
    for i in range(n):
        t += random.expovariate(1 / arrival_mean)
        service_time = random.expovariate(1 / service_mean)
        if priorities and i < len(priorities):
            pr = priorities[i]
        else:
            pr = random.randint(1, max_priority) if max_priority else None
        customers.append({
            "id": i + 1,
            "arrival_time": t,
            "service_time": service_time,
            "priority": pr
        })
    return customers

# -------------- FCFS multi-server (non-priority) --------------

def run_fcfs_simulation(params: SimulationParams) -> SimulationResponse:
    customers = _generate_customers(
        n=params.num_customers,
        arrival_mean=params.arrival_mean,
        service_mean=params.service_mean,
        # priorities=None,
        # max_priority=0  # FCFS, no priority
    )
    servers_free_at = [0.0] * params.num_servers
    completed: List[SimulationResult] = []

    customers.sort(key=lambda x: x["arrival_time"])

    for cust in customers:
        sid = min(range(params.num_servers), key=lambda s: servers_free_at[s])
        start = max(cust["arrival_time"], servers_free_at[sid])
        end = start + cust["service_time"]
        servers_free_at[sid] = end

        wait = start - cust["arrival_time"]
        tat = end - cust["arrival_time"]
        rt = wait  # non-preemptive

        completed.append(SimulationResult(
            customer_id=cust["id"],
            arrival_time=cust["arrival_time"],
            service_time=cust["service_time"],
            start_time=start,
            end_time=end,
            wait_time=wait,
            turnaround_time=tat,
            response_time=rt,
            server_id=sid+1,
            # priority=None
        ))

    return _build_response(completed, params.num_servers)

# -------------- Priority queue (non-preemptive) --------------

def run_priority_simulation(params: PrioritySimulationParams) -> SimulationResponse:
    """
    Non-preemptive priority M/G/c simulator.
    Lower integer priority = higher priority if priority_low_is_high=True.
    """
    customers = _generate_customers(
        n=params.num_customers,
        arrival_mean=params.arrival_mean,
        service_mean=params.service_mean,
        priorities=params.priorities,
        max_priority=params.max_priority
    )

    t = 0.0
    next_idx = 0
    servers_free_at = [0.0] * params.num_servers
    busy = [False] * params.num_servers

    # waiting queue: (priority_key, arrival_time, seq, customer_dict)
    pq: List[Tuple[Tuple[int, float, int], dict]] = []
    seq = 0
    completed: List[SimulationResult] = []

    customers.sort(key=lambda x: x["arrival_time"])

    def push_waiting(c):
        nonlocal seq
        raw_pr = c["priority"] if c["priority"] is not None else 10**6
        pr = raw_pr if params.priority_low_is_high else -raw_pr
        key = (pr, c["arrival_time"], seq)
        heapq.heappush(pq, (key, c))
        seq += 1

    while next_idx < len(customers) or pq or any(busy):
        next_arrival = customers[next_idx]["arrival_time"] if next_idx < len(customers) else math.inf
        next_completion = min((servers_free_at[s] for s in range(params.num_servers) if busy[s]), default=math.inf)

        t = min(next_arrival, next_completion)

        # push all arrivals up to time t
        while next_idx < len(customers) and customers[next_idx]["arrival_time"] <= t:
            push_waiting(customers[next_idx])
            next_idx += 1

        # free any server that completes at time t
        for s in range(params.num_servers):
            if busy[s] and math.isclose(servers_free_at[s], t):
                busy[s] = False

        # assign available servers to highest-priority jobs
        for s in range(params.num_servers):
            if not busy[s] and pq:
                _key, c = heapq.heappop(pq)
                start = max(t, servers_free_at[s])
                end = start + c["service_time"]
                servers_free_at[s] = end
                busy[s] = True

                wait = start - c["arrival_time"]
                tat = end - c["arrival_time"]
                rt = wait

                completed.append(SimulationResult(
                    customer_id=c["id"],
                    arrival_time=c["arrival_time"],
                    service_time=c["service_time"],
                    start_time=start,
                    end_time=end,
                    wait_time=wait,
                    turnaround_time=tat,
                    response_time=rt,
                    server_id=s,
                    priority=c.get("priority")
                ))

    return _build_response(completed, params.num_servers)

# -------------- Queueing Calculator (M/M/c) --------------

def _factorial(n: int) -> float:
    return math.factorial(n)

def _P0_mm_c(lmbda: float, mu: float, c: int) -> float:
    rho = lmbda / (c * mu)
    if rho >= 1.0:
        return 0.0
    summation = sum((lmbda / mu) ** n / _factorial(n) for n in range(c))
    last = ((lmbda / mu) ** c) / (_factorial(c) * (1 - rho))
    return 1.0 / (summation + last)

def _Pw_mm_c(lmbda: float, mu: float, c: int, P0: float) -> float:
    rho = lmbda / (c * mu)
    if rho >= 1.0:
        return 1.0
    numerator = ((lmbda / mu) ** c) / (_factorial(c) * (1 - rho))
    return numerator * P0

def queue_calc_mm_c(params: QueueCalcParams) -> QueueCalcResponse:
    lmbda = params.arrival_rate
    mu = params.service_rate
    c = params.servers

    rho = lmbda / (c * mu)
    if rho >= 1.0:
        return QueueCalcResponse(
            utilization=rho, P0=0.0, Pw=1.0,
            Lq=math.inf, Wq=math.inf, W=math.inf, L=math.inf
        )

    P0 = _P0_mm_c(lmbda, mu, c)
    Pw = _Pw_mm_c(lmbda, mu, c, P0)
    Lq = Pw * (lmbda * mu) * ((lmbda / mu) ** (c - 1)) / ((_factorial(c - 1)) * ((c * mu - lmbda) ** 2))
    Wq = Lq / lmbda
    W = Wq + 1 / mu
    L = lmbda * W

    return QueueCalcResponse(utilization=rho, P0=P0, Pw=Pw, Lq=Lq, Wq=Wq, W=W, L=L)
