from retrieval.search import search
from llm.ollama_client import ask_llama

MAX_CONTEXT_CHARS = 3000
TOP_K = 5


def build_context(chunks):
    """
    Build and safely trim context for the LLM.
    """
    if not chunks:
        return ""

    context = "\n\n".join(chunks)

    # Prevent token overflow / huge prompts
    return context[:MAX_CONTEXT_CHARS]


def build_prompt(context: str, question: str) -> str:
    """
    Strong structured prompt for better LLM behavior.
    """

    return f"""
SYSTEM:
You are a precise and reliable school assistant AI.

RULES:
- Use ONLY the provided context to answer.
- If the answer is not found in the context, respond exactly:
  "I don't know based on the available information."
- Do NOT guess or hallucinate.
- Be clear, short, and factual.

CONTEXT:
{context if context else "NO RELEVANT CONTEXT FOUND"}

USER QUESTION:
{question}

FINAL ANSWER:
""".strip()


def answer_question(question: str):
    # 1. Retrieve relevant chunks from vector DB
    chunks = search(question, top_k=TOP_K)  # assumes your search supports it

    # 2. Build safe context
    context = build_context(chunks)

    # 3. Build structured prompt
    prompt = build_prompt(context, question)

    # =========================
    # DEBUGGING (IMPORTANT FOR INTERVIEWS)
    # =========================
    print("\n================ RETRIEVED CHUNKS ================\n")
    print(chunks)

    print("\n================ CONTEXT (TRIMMED) ================\n")
    print(context)

    print("\n================ PROMPT SENT TO LLM ================\n")
    print(prompt)

    # 4. Call LLM
    response = ask_llama(prompt)

    return response


# --------------------------
# Local testing
# --------------------------
if __name__ == "__main__":
    q = "Can students sit exams if fees are not paid?"
    print("\nFINAL ANSWER:\n", answer_question(q))