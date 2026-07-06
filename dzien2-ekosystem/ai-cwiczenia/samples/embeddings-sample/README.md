# embeddings-sample

Minimalne demo **embeddingów** przez OpenRouter (endpoint OpenAI-compatible `/api/v1/embeddings`)
i **mini semantic search** — sedno RAG: bliskość wektorów = podobieństwo znaczeń.

Program embedduje kilka zdań z domeny wsparcia/ticketów oraz pytanie
(„Nie mogę się zalogować”), liczy cosine similarity pytania do każdego dokumentu
(`TensorPrimitives.CosineSimilarity`) i wypisuje ranking — najbardziej podobny na górze.

## Uruchomienie

1. Wpisz klucz OpenRouter w `../../ai-settings.json` (`Ai:Providers:openrouter:ApiKey`)
   lub ustaw zmienną środowiskową:
   ```bash
   export OPENROUTER_API_KEY="sk-or-..."
   ```
2. Uruchom:
   ```bash
   dotnet run --project embeddings-sample.csproj
   ```

## Model embeddingu

Domyślnie `openai/text-embedding-3-small` (stała w `Program.cs`) — konfigurowalny.
Klucz i endpoint pochodzą ze wspólnego `ai-settings.json` przez `AiLab.Llm`, model
embeddingu trzymamy osobno od modelu czatu.
