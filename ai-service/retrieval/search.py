from sentence_transformers import SentenceTransformer
import chromadb

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Connect to vector DB
client = chromadb.PersistentClient(path="vector_db")
collection = client.get_collection("school_policy")


def search(query, top_k=3):
    # Convert question → vector
    query_vector = model.encode(query).tolist()

    # Search similar chunks
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=top_k
    )

    return results["documents"][0]