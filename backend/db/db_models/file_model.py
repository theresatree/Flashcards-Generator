from sqlmodel import Field, SQLModel 
from sqlalchemy import Column, LargeBinary
from datetime import datetime

class FileStorage(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    fileName: str = Field(index=True, max_length=255)
    file_size: int
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    content: bytes = Field(sa_column=Column(LargeBinary), repr=False)
