from retrieval.search import search
from llm.ollama_client import ask_llama


def answer_question(question: str):
    # 1. Get relevant chunks from vector DB
    chunks = search(question)

    # 2. Build context for the LLM
    context = "\n\n".join(chunks)

    # 3. Create prompt (this is the key RAG step)
    prompt = f"""
You are a school assistant AI.

Use ONLY the context below to answer the question.
If the answer is not in the context, say you don't know.

CONTEXT:
{context}

QUESTION:
{question}

ANSWER:
"""

    # 4. Ask LLM
    return ask_llama(prompt)


if __name__ == "__main__":
    q = "Can students sit exams if fees are not paid?"
    print(answer_question(q))