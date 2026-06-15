from sentence_transformers import SentenceTransformer
import chromadb
from ingestion.chunker import chunk_text

# ----------------------------
# LOAD MODEL (MEANING ENGINE)
# ----------------------------
model = SentenceTransformer("all-MiniLM-L6-v2")

# ----------------------------
# LOAD DOCUMENT
# ----------------------------
with open("data/school_policy.txt", "r", encoding="utf-8") as f:
    text = f.read()

# ----------------------------
# CHUNK IT
# ----------------------------
chunks = chunk_text(text)

print(f"Total chunks: {len(chunks)}")

# ----------------------------
# CREATE VECTOR DATABASE
# ----------------------------
client = chromadb.PersistentClient(path="vector_db")
collection = client.get_or_create_collection(name="school_policy")

# ----------------------------
# EMBED + STORE
# ----------------------------
for i, chunk in enumerate(chunks):
    vector = model.encode(chunk).tolist()

    collection.add(
        documents=[chunk],
        embeddings=[vector],
        ids=[f"chunk_{i}"]
    )

    print(f"Stored chunk {i}")

print("\nDONE: All chunks embedded and stored.")