from pydantic import BaseModel
from typing import List, Optional

class SimulationParams(BaseModel):
    num_customers: int
    num_servers: int
    arrival_mean: float
    service_mean: float
    priorities: Optional[List[int]] = None  

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

class SimulationResponse(BaseModel):
    results: List[SimulationResult]
    average_wait_time: float
    average_turnaround_time: float
    server_utilization: float
