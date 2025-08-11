from fastapi import APIRouter, HTTPException
from backend.app.models.simulator_models import SimulationParams, SimulationResponse
from backend.app.services.simulator_service import run_simulation

router = APIRouter()

@router.post("/simulate", response_model=SimulationResponse)
def simulate(params: SimulationParams):
    try:
        results, avg_wait, avg_tat, utilization = run_simulation(params)
        return SimulationResponse(
            results=results,
            average_wait_time=avg_wait,
            average_turnaround_time=avg_tat,
            server_utilization=utilization
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
