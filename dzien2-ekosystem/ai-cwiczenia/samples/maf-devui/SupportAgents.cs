using Microsoft.Agents.AI;
using Microsoft.Agents.AI.Workflows;
using Microsoft.Extensions.AI;

internal static class SupportAgents
{
    public static AIAgent Triage(IChatClient chat) => chat.AsAIAgent(
        instructions: "Jesteś triażem wsparcia. Klasyfikujesz zgłoszenie i sprawdzasz status " +
                      "narzędziem GetTicketStatus. Odpowiadaj krótko, po polsku.",
        name: "triage",
        tools: [AIFunctionFactory.Create(SupportTools.GetTicketStatus, name: "get_ticket_status")]);

    public static AIAgent Billing(IChatClient chat) => chat.AsAIAgent(
        instructions: "Jesteś specjalistą ds. rozliczeń. Sprawdzasz fakturę narzędziem GetInvoiceStatus " +
                      "i proponujesz następny krok. Odpowiadaj krótko, po polsku.",
        name: "billing",
        tools: [AIFunctionFactory.Create(SupportTools.GetInvoiceStatus, name: "get_invoice_status")]);

    public static AIAgent Responder(IChatClient chat) => chat.AsAIAgent(
        instructions: "Na podstawie ustaleń triage i rozliczeń napisz jedną, uprzejmą, gotową do wysłania " +
                      "odpowiedź do klienta. Bez wewnętrznych notatek — sam tekst wiadomości. Po polsku.",
        name: "responder");

    public static Workflow SupportFlow(IChatClient chat) =>
        AgentWorkflowBuilder.BuildSequential("support-flow", [Triage(chat), Billing(chat), Responder(chat)]);
}
