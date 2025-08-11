from fastapi import FastAPI
from backend.app.routers import simulator_router

app = FastAPI(title="Simulator API")

app.include_router(simulator_router.router, prefix="/api", tags=["Simulator"])

@app.get("/")
def root():
    return {"message": "Simulator API is running!"}
