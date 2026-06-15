from ingestion.chunker import chunk_text


with open("data/school_policy.txt", "r", encoding="utf-8") as file:
    text = file.read()


chunks = chunk_text(text)


print("Total chunks:", len(chunks))


for i, chunk in enumerate(chunks):
    print("\n--- CHUNK", i, "---")
    print(chunk)