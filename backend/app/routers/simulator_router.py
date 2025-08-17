from fastapi import APIRouter, HTTPException
from backend.app.models.simulator_models import (
    SimulationParams, PrioritySimulationParams, SimulationResponse,
    QueueCalcParams, QueueCalcResponse
)
from backend.app.services.simulator_service import (
    run_fcfs_simulation, run_priority_simulation, queue_calc_mm_c
)

router = APIRouter()

@router.post("/simulate", response_model=SimulationResponse)
def simulate_fcfs(params: SimulationParams):
    try:
        return run_fcfs_simulation(params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/simulate/priority", response_model=SimulationResponse)
def simulate_priority(params: PrioritySimulationParams):
    try:
        return run_priority_simulation(params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/queueing/calculate", response_model=QueueCalcResponse)
def queueing_calculator(params: QueueCalcParams):
    try:
        return queue_calc_mm_c(params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
