from pydantic import BaseModel, Field
from typing import List, Optional

# ----------- Simulation (FCFS) -----------

class SimulationParams(BaseModel):
    num_customers: int = Field(gt=0, description="Total customers to simulate")
    num_servers: int = Field(gt=0, description="Parallel servers")
    arrival_mean: float = Field(default=5.0, gt=0, description="Mean of exponential inter-arrival (optional)")
    service_mean: float = Field(default=4.0, gt=0, description="Mean of exponential service time (optional)")

class PrioritySimulationParams(BaseModel):
    num_customers: int = Field(gt=0)
    num_servers: int = Field(gt=0)
    arrival_mean: float = Field(default=5.0, gt=0)
    service_mean: float = Field(default=4.0, gt=0)
    priorities: Optional[List[int]] = None
    max_priority: int = Field(default=3, gt=0, description="Random priorities 1..max_priority if priorities not provided")
    # low number => higher priority (classic)
    priority_low_is_high: bool = True

class GanttBar(BaseModel):
    server_id: int
    customer_id: int
    start_time: float
    end_time: float

class SimulationResult(BaseModel):
    customer_id: int
    arrival_time: float
    service_time: float
    start_time: float
    end_time: float
    wait_time: float
    turnaround_time: float
    response_time: float
    server_id: int
    priority: Optional[int] = None

class SimulationResponse(BaseModel):
    results: List[SimulationResult]
    average_wait_time: float
    average_turnaround_time: float
    server_utilization: float
    gantt: List[GanttBar]

# ----------- Queueing Calculator (M/M/c) -----------

class QueueCalcParams(BaseModel):
    arrival_rate: float = Field(gt=0, description="λ")
    service_rate: float = Field(gt=0, description="μ (per server)")
    servers: int = Field(gt=0, description="c")

class QueueCalcResponse(BaseModel):
    utilization: float  # ρ = λ / (c μ)
    P0: float           # idle probability
    Pw: float           # wait probability (Erlang C)
    Lq: float           # expected queue length
    Wq: float           # expected waiting time in queue
    W: float            # expected total time in system
    L: float            # expected number in system
