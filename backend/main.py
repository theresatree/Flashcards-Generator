from fastapi import FastAPI, Request
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

##################### MODEL AND LOADING #################

class EmbedRequest(BaseModel):
    text: str

model = SentenceTransformer("embedding_model/all-MiniLM-L6-v2")

#################### API #####################

app = FastAPI()

@app.post("/embedChunks")
async def embed_chunks(body: EmbedRequest):
    # Embed the received text
    embedding = model.encode(body.text).tolist()
    return {"embedding": embedding}


#################### CORS #########################

allow_origins = [
    "http://localhost:5173",
    "http://localhost:5174"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins, 
    allow_methods=["*"],
    allow_headers=["*"],
)  
