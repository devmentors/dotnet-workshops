using System.Text.Json;
using AiLab.Agent.Tools;
using AiLab.Shared;
using Microsoft.Extensions.AI;

namespace AiLab.Agent.ManualLoop;

public static class ManualToolLoop
{
    // ZADANIE (#12): Recznie obsluz function calling z modelu LLM
    public static async Task<string> RunAsync(IChatClient client, AIFunction tool, string question)
    {
        var messages = new List<ChatMessage> { new(ChatRole.User, question) };
        var options = new ChatOptions { Tools = [tool] };
        var pretty = new JsonSerializerOptions { WriteIndented = true };

        Console.WriteLine($"── PYTANIE: {question} ──");
        Console.WriteLine("── TURA 1: pytamy model ──");
        var response = await client.GetResponseAsync(messages, options);
        messages.AddMessages(response);
        
        foreach (var content in response.Messages.SelectMany(m => m.Contents))
        {
            Console.WriteLine(content switch
            {
                TextContent text => $"[TEXT] {text.Text}",
                FunctionCallContent call =>
                    $"[FUNCTION CALL] {call.Name}\n{JsonSerializer.Serialize(call.Arguments, pretty)}",
                _ => $"[{content.GetType().Name}]",
            });

            // TODO (#12): Wykryto function calling?
            if (content is FunctionCallContent toolCall)
            {
                //TODO (#12): Wykonaj!
                // HINT: Jego wynik musi poleciec z powrotem do `messages` — inaczej model nie zobaczy go w TURZE 2 i nie zinterpretuje.
                
                // Cross-check na niewykonane zadanie - inaczej LLM zwraca 400ke
                if (!messages.SelectMany(m => m.Contents).OfType<FunctionResultContent>().Any())
                {
                    messages.Add(new ChatMessage(
                        ChatRole.Tool, 
                        [new FunctionResultContent(toolCall.CallId, "Brak wyniku narzedzia...")]));
                
                    Console.WriteLine("(brak wyniku narzędzia — uzupełnij TODO w #12)");
                }
            }
        }

        Console.WriteLine("── TURA 2: model układa finalną odpowiedź ──");
        var final = await client.GetResponseAsync(messages, options);
        Console.WriteLine($"[FINAL] {final.Text}");
        return final.Text;
    }

    public static async Task<string> ExampleAsync(IChatClient baseClient, AIFunction tool, string question)
    {
        IChatClient chat = baseClient.AsBuilder()
            .UseFunctionInvocation()
            //.UseCostTracking()
            .Build();
        var response = await chat.GetResponseAsync(question, new ChatOptions { Tools = [tool] });
        return response.Text;
    }
}
