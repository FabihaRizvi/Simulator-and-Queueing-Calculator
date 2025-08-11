import random
from typing import List
from backend.app.models.simulator_models import SimulationParams, SimulationResult, SimulationResponse

class Simulator:
    def __init__(self, params: SimulationParams):
        self.params = params

    def run(self) -> SimulationResponse:
        customers = self._generate_customers()
        servers = [0.0] * self.params.num_servers  
        completed_customers = []

        for customer in customers:
            server_id = min(range(len(servers)), key=lambda s: servers[s])
            start_time = max(customer["arrival_time"], servers[server_id])
            end_time = start_time + customer["service_time"]

            servers[server_id] = end_time

            wait_time = start_time - customer["arrival_time"]
            tat = end_time - customer["arrival_time"]
            rt = wait_time  

            completed_customers.append(
                SimulationResult(
                    customer_id=customer["id"],
                    arrival_time=customer["arrival_time"],
                    service_time=customer["service_time"],
                    start_time=start_time,
                    end_time=end_time,
                    wait_time=wait_time,
                    turnaround_time=tat,
                    response_time=rt,
                    server_id=server_id
                )
            )

        avg_wait = sum(c.wait_time for c in completed_customers) / len(completed_customers)
        avg_tat = sum(c.turnaround_time for c in completed_customers) / len(completed_customers)
        total_time = max(c.end_time for c in completed_customers)
        utilization = sum(c.service_time for c in completed_customers) / (self.params.num_servers * total_time)

        return SimulationResponse(
            results=completed_customers,
            average_wait_time=avg_wait,
            average_turnaround_time=avg_tat,
            server_utilization=utilization
        )

    def _generate_customers(self):
        customers = []
        arrival_time = 0.0
        priorities = self.params.priorities or []

        for i in range(self.params.num_customers):
            inter_arrival = random.expovariate(1 / self.params.arrival_mean)
            arrival_time += inter_arrival
            service_time = random.expovariate(1 / self.params.service_mean)
            priority = priorities[i] if i < len(priorities) else None

            customers.append({
                "id": i + 1,
                "arrival_time": arrival_time,
                "service_time": service_time,
                "priority": priority
            })

        if any(c["priority"] is not None for c in customers):
            customers.sort(key=lambda x: (x["priority"], x["arrival_time"]))
        else:
            customers.sort(key=lambda x: x["arrival_time"])

        return customers

def run_simulation(params: SimulationParams):
    simulator = Simulator(params)
    response = simulator.run()
    return response.results, response.average_wait_time, response.average_turnaround_time, response.server_utilization
