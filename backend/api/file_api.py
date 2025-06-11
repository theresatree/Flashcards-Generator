from fastapi import APIRouter, UploadFile, File, Depends, Form
from sqlmodel import Session

from pydantic_schemas.models import FileSchema
from db.db_setup import get_session
from db.db_service.file_db import db_upload_file

router = APIRouter()
 
@router.post("/upload")
async def upload_file(session: Session = Depends(get_session),
                      file: UploadFile = File(...),
                      filename:str = Form(...),
                      file_size: int = Form(...)
                      ):

    contents = await file.read()
    file_information = FileSchema(
            filename=filename,
            file_size=file_size,
            contents=contents
    )
    db_upload_file(session=session, file=file_information) 
    return {"status": "Uploaded"}
