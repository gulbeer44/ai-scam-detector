from fastapi import FastAPI
from pydantic import BaseModel
from model import analyze_message

app = FastAPI()

class MessageRequest(BaseModel):
    text: str

@app.post("/predict")
def predict(req: MessageRequest):
    return analyze_message(req.text)