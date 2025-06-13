from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from services.genai import get_explanations
from utils.logger import log_request

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/explain")
async def explain(topic: str = Query(...)):
    explanations = await get_explanations(topic)
    log_request(topic, explanations)
    return explanations
