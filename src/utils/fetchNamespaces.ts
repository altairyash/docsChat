export async function fetchNamespaces(setNamespaces: Function, setIsNamespacesLoading: Function, toast: { error: (message: string) => void }) {
    try {
      const res = await fetch("/api/namespaces");
      const data = await res.json();
      setNamespaces(
        data.namespaces
          .filter((ns: string) => ns !== "")
          .map((ns: string) => ({ value: ns, label: ns }))
      );
    } catch (error) {
      toast.error("Error fetching namespaces");
      console.error(error);
    } finally {
      setIsNamespacesLoading(false);
    }
  }
  
  export async function handleQuery({
    selectedNamespace,
    question,
    cache,
    setCache,
    setAnswer,
    setIsLoading,
    toast,
  }: {
    selectedNamespace: string | null;
    question: string;
    cache: { [key: string]: string };
    setCache: Function;
    setAnswer: Function;
    setIsLoading: Function;
    toast: { error: (message: string) => void };
  }) {
    if (!selectedNamespace) {
      toast.error("Please select a namespace first.");
      return;
    }
    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }
  
    const cacheKey = `${selectedNamespace}-${question}`;
    if (cache[cacheKey]) {
      setAnswer(cache[cacheKey]);
      return;
    }
  
    setIsLoading(true);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, namespace: selectedNamespace }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      setCache((prevCache: { [key: string]: string }) => ({ ...prevCache, [cacheKey]: data.answer }));
    } catch (error) {
      toast.error("Failed to fetch answer.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  