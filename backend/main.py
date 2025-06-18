from os import wait
from fastapi import FastAPI, Body
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import configparser

##################### MODEL AND LOADING #################

class EmbedRequest(BaseModel):
    text: str

model = SentenceTransformer("embedding_model/all-MiniLM-L6-v2")


##################### GOOGLE AI ########################
config = configparser.ConfigParser()
config.read('config.ini')
api_key = config['GEMINI']['API_KEY']


client = genai.Client(api_key=api_key)

#################### API #####################

app = FastAPI()

@app.post("/embedChunks")
async def embed_chunks(body: EmbedRequest):
    # Embed the received text
    embedding = model.encode(body.text).tolist()
    return {"embedding": embedding}

@app.post("/sendToLLM")
async def send_to_LLM(contents: str = Body(...)):
    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=contents
    )
    return {"text": response.text} 

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
