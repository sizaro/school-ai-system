from retrieval.search import search

while True:
    q = input("\nAsk: ")

    results = search(q)

    print("\n--- TOP MATCHES ---\n")
    for r in results:
        print("-", r)