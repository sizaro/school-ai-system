from collections import deque
from retrieval.search import search
from llm.ollama_client import ask_llama

MAX_CONTEXT_CHARS = 3000
TOP_K = 5

# =========================
# 🧠 SIMPLE CHAT MEMORY (SHORT-TERM)
# =========================
chat_memory = deque(maxlen=10)


# --------------------------
# MEMORY FUNCTIONS
# --------------------------
def update_memory(role: str, message: str):
    """
    Stores conversation history (user + assistant).
    """
    chat_memory.append({
        "role": role,
        "message": message
    })


def format_memory():
    """
    Converts memory into LLM-readable format.
    """
    if not chat_memory:
        return ""

    return "\n".join(
        [f"{m['role'].upper()}: {m['message']}" for m in chat_memory]
    )


# --------------------------
# CONTEXT BUILDER
# --------------------------
def build_context(chunks):
    """
    Build and safely trim context for the LLM.
    """
    if not chunks:
        return ""

    context = "\n\n".join(chunks)

    # Prevent token overflow / huge prompts
    return context[:MAX_CONTEXT_CHARS]


# --------------------------
# PROMPT ENGINEERING
# --------------------------
def build_prompt(context: str, question: str, memory: str) -> str:
    """
    Strong structured prompt combining:
    - memory (conversation history)
    - RAG context
    """

    return f"""
SYSTEM:
You are a precise and reliable school assistant AI.

RULES:
- Use ONLY the provided context and conversation history.
- If the answer is not found, say:
  "I don't know based on the available information."
- Do NOT guess or hallucinate.
- Be natural and conversational when needed.

CONVERSATION HISTORY:
{memory if memory else "NO PREVIOUS CONVERSATION"}

RETRIEVED CONTEXT:
{context if context else "NO RELEVANT CONTEXT FOUND"}

USER QUESTION:
{question}

FINAL ANSWER:
""".strip()


# --------------------------
# MAIN RAG + MEMORY PIPELINE
# --------------------------
def answer_question(question: str):

    # 1. Store user input in memory
    update_memory("user", question)

    # 2. Retrieve relevant chunks from vector DB
    chunks = search(question, top_k=TOP_K)

    # 3. Build context
    context = build_context(chunks)

    # 4. Build conversation memory
    memory_text = format_memory()

    # 5. Build final prompt
    prompt = build_prompt(context, question, memory_text)

    # =========================
    # 🔍 DEBUGGING (INTERVIEW GOLD)
    # =========================
    print("\n================ RETRIEVED CHUNKS ================\n")
    print(chunks)

    print("\n================ MEMORY ================\n")
    print(memory_text)

    print("\n================ CONTEXT (TRIMMED) ================\n")
    print(context)

    print("\n================ PROMPT SENT TO LLM ================\n")
    print(prompt)

    # 6. Call LLM
    response = ask_llama(prompt)

    # 7. Store assistant response in memory
    update_memory("assistant", response)

    return response


# --------------------------
# LOCAL TESTING
# --------------------------
if __name__ == "__main__":
    print("\n--- TEST CHAT ---\n")

    while True:
        q = input("You: ")
        if q.lower() in ["exit", "quit"]:
            break

        answer = answer_question(q)
        print("\nAI:", answer, "\n")