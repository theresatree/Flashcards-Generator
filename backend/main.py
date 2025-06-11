from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.db_setup import create_db_and_tables
 
from api.file_api import router as file_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Anything before "yield" is ran during startup
    Anything after "yield" is ran during shutdown
    """
    create_db_and_tables()
    yield

app = FastAPI(
        lifespan = lifespan,
        title="QnA Generator",
        description="Generate Flashcards via Files")
 
origins = [
    "http://localhost:5173",  # React frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow only specific origins (i.e., React frontend)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(file_router, prefix="/api")
