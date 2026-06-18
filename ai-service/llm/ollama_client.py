import requests


OLLAMA_URL = "http://localhost:11434/api/generate"


def ask_llama(prompt):
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        }
    )

    result = response.json()

    return result["response"]


if __name__ == "__main__":
    answer = ask_llama("Explain what a school attendance policy is.")
    print(answer)