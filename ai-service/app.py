from fastapi import FastAPI
from pydantic import BaseModel

from rag import answer_question

app = FastAPI()


class QuestionRequest(BaseModel):
    question: str


@app.post("/ask")
def ask(req: QuestionRequest):
    response = answer_question(req.question)
    return {
        "answer": response
    }


@app.get("/")
def home():
    return {"message": "AI Service is running"}