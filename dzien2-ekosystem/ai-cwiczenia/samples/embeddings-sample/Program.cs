// Embeddingi przez OpenRouter (OpenAI-compatible /embeddings) + mini semantic search — sedno RAG.

using System.ClientModel;
using System.Numerics.Tensors;
using AiLab.Llm;
using Microsoft.Extensions.AI;
using OpenAI;

var provider = AiSettings.Load().Active;
var apiKey = !string.IsNullOrWhiteSpace(provider.ApiKey)
    ? provider.ApiKey
    : Environment.GetEnvironmentVariable("OPENROUTER_API_KEY")
        ?? throw new InvalidOperationException(
            "Brak klucza OpenRouter — wpisz Ai:Providers:openrouter:ApiKey lub ustaw OPENROUTER_API_KEY.");
var endpoint = provider.Endpoint ?? "https://openrouter.ai/api/v1";

const string embeddingModel = "openai/text-embedding-3-small";

IEmbeddingGenerator<string, Embedding<float>> generator =
    new OpenAIClient(new ApiKeyCredential(apiKey), new OpenAIClientOptions { Endpoint = new Uri(endpoint) })
        .GetEmbeddingClient(embeddingModel)
        .AsIEmbeddingGenerator();

string[] documents =
[
    "Aby zresetować hasło, kliknij „Nie pamiętam hasła” na ekranie logowania i sprawdź skrzynkę e-mail.",
    "Faktury i historię płatności znajdziesz w panelu Rozliczenia po zalogowaniu.",
    "Wsparcie techniczne działa od poniedziałku do piątku w godzinach 9:00–17:00.",
    "Konto zostaje zablokowane po pięciu nieudanych próbach logowania; odblokowanie następuje po 15 minutach.",
    "Dane osobowe możesz zmienić w zakładce Profil w ustawieniach konta.",
];

const string question = "Nie mogę się zalogować";

Console.WriteLine($"Model embeddingu: {embeddingModel}");
Console.WriteLine($"Pytanie: \"{question}\"\n");

var docEmbeddings = await generator.GenerateAsync(documents);
var questionEmbedding = await generator.GenerateAsync(question);

var ranking = documents
    .Select((text, i) => (text, score: TensorPrimitives.CosineSimilarity(
        questionEmbedding.Vector.Span, docEmbeddings[i].Vector.Span)))
    .OrderByDescending(x => x.score)
    .ToList();

Console.WriteLine("Ranking dokumentów (podobieństwo → treść):");
foreach (var (text, score) in ranking)
    Console.WriteLine($"  {score:0.000}  {text}");
