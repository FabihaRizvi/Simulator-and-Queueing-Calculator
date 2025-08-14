from fastapi import FastAPI
from backend.app.routers import simulator_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Simulator API", version="1.0.0")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
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
