from fastapi import FastAPI
from app.routers import simulator_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Simulator API")

origins = [
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,
    allow_methods=["*"],              
    allow_headers=["*"],              
)

app.include_router(simulator_router.router, prefix="/api", tags=["Simulator"])

@app.get("/")
def root():
    return {"message": "Simulator API is running!"}
