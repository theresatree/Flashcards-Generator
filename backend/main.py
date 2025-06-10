from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import FastAPI, Depends
from sqlmodel import Session

from pydantic_schemas.models import Item
from db.db_setup import get_session,create_db_and_tables,Hero

Session = Annotated[Session, Depends(get_session)]

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Anything before "yield" is ran during startup
    Anything after "yield" is ran during shutdown
    """
    create_db_and_tables()
    yield

app = FastAPI(lifespan = lifespan)


@app.get("/")
async def root ():
    return {"message": "Hello World"}

@app.post("/items/")
def create_item(item: Item):
    return item

