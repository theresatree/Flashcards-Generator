from fastapi import HTTPException
from sqlmodel import Session
from db.db_models.file_model import FileStorage
from pydantic_schemas.models import FileSchema 

def db_upload_file(session: Session, file: FileSchema):
    try:
        db_file = FileStorage(
            fileName=file.filename,
            file_size=file.file_size,
            content=file.contents
        )
        session.add(db_file)
        session.commit()
        session.refresh(db_file)
        return db_file
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

