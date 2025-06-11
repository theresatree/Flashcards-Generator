from pydantic import BaseModel

class FileSchema(BaseModel):
    filename: str
    file_size: int
    contents: bytes
