using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;
using MySpot.Shared.Abstractions.Messaging;
using MySpot.Shared.Abstractions.Modules;
using MySpot.Shared.Abstractions.Time;
using MySpot.Shared.Infrastructure.Contexts;
using MySpot.Shared.Infrastructure.Messaging.Contexts;
using MySpot.Shared.Infrastructure.Messaging.Dispatchers;
using MySpot.Shared.Infrastructure.Messaging.Outbox;
using MySpot.Shared.Infrastructure.Serialization;
using Xunit;

namespace MySpot.Workshops.Tests;

/// <summary>
/// Exercise 7: Outbox Pattern - Bug Hunt
///
/// These tests verify that the Outbox Pattern implementation works correctly.
/// The outbox ensures reliable message delivery by:
/// 1. Saving messages to database before publishing
/// 2. Publishing unsent messages via background processor
/// 3. Marking messages as sent after successful publishing
///
/// Your task: Find and fix the bug(s) in EfOutbox.cs!
/// </summary>
public class Exercise07_OutboxPatternBugHuntTests
{
    private readonly DateTime _testTime = new(2024, 1, 15, 12, 0, 0);

    #region Test 1: Messages should be persisted to database

    [Fact]
    public async Task SaveAsync_ShouldPersistMessagesToDatabase()
    {
        // Arrange
        var (outbox, context) = CreateOutbox();
        var testMessage = new TestOutboxMessage("Test content");

        // Act
        await outbox.SaveAsync(testMessage);

        // Assert - Messages should be persisted to database
        var savedMessages = await context.Set<OutboxMessage>().ToListAsync();

        Assert.NotEmpty(savedMessages);
        Assert.Single(savedMessages);
        Assert.Equal("test_outbox_message", savedMessages[0].Name);
        Assert.Null(savedMessages[0].SentAt);
    }

    #endregion

    #region Test 2: PublishUnsent should query unsent messages (SentAt == null)

    [Fact]
    public async Task PublishUnsentAsync_ShouldQueryUnsentMessages()
    {
        // Arrange
        var (outbox, context) = CreateOutbox();

        // Add messages directly to simulate pre-existing unsent messages
        var unsentMessage = new OutboxMessage
        {
            Id = Guid.NewGuid(),
            Name = "test_outbox_message",
            Type = typeof(TestOutboxMessage).AssemblyQualifiedName!,
            Data = "{\"Content\":\"Unsent\"}",
            CreatedAt = _testTime,
            SentAt = null // UNSENT - should be picked up
        };

        var sentMessage = new OutboxMessage
        {
            Id = Guid.NewGuid(),
            Name = "test_outbox_message",
            Type = typeof(TestOutboxMessage).AssemblyQualifiedName!,
            Data = "{\"Content\":\"Already sent\"}",
            CreatedAt = _testTime,
            SentAt = _testTime // ALREADY SENT - should NOT be picked up
        };

        context.Set<OutboxMessage>().AddRange(unsentMessage, sentMessage);
        await context.SaveChangesAsync();

        // Act
        await outbox.PublishUnsentAsync();

        // Assert - Only unsent message should be published
        // The sent message (SentAt != null) should NOT be queried
        var messages = await context.Set<OutboxMessage>().ToListAsync();
        var nowSentMessages = messages.Where(m => m.SentAt != null && m.SentAt > _testTime).ToList();

        // Exactly ONE message should have been newly marked as sent (the one that was unsent)
        Assert.Single(nowSentMessages);
        Assert.Equal(unsentMessage.Id, nowSentMessages[0].Id);
    }

    #endregion

    #region Test 3: Messages should be marked as sent after publishing

    [Fact]
    public async Task PublishUnsentAsync_ShouldMarkMessagesAsSent()
    {
        // Arrange
        var (outbox, context) = CreateOutbox();

        // Add an unsent message
        var messageId = Guid.NewGuid();
        var unsentMessage = new OutboxMessage
        {
            Id = messageId,
            Name = "test_outbox_message",
            Type = typeof(TestOutboxMessage).AssemblyQualifiedName!,
            Data = "{\"Content\":\"Test\"}",
            CreatedAt = _testTime,
            SentAt = null
        };

        context.Set<OutboxMessage>().Add(unsentMessage);
        await context.SaveChangesAsync();

        // Act
        await outbox.PublishUnsentAsync();

        // Assert - Message should be marked as sent (SentAt should be set)
        var message = await context.Set<OutboxMessage>().FindAsync(messageId);

        Assert.NotNull(message);
        Assert.NotNull(message!.SentAt);
    }

    #endregion

    #region Test 4: Full Integration - Save and Publish flow

    [Fact]
    public async Task FullIntegration_SaveThenPublish_ShouldWorkCorrectly()
    {
        // Arrange
        var moduleClientMock = new Mock<IModuleClient>();
        var publishedMessages = new List<object>();

        moduleClientMock
            .Setup(x => x.PublishAsync(It.IsAny<object>(), It.IsAny<CancellationToken>()))
            .Callback<object, CancellationToken>((msg, ct) => publishedMessages.Add(msg))
            .Returns(Task.CompletedTask);

        var (outbox, context) = CreateOutbox(moduleClientMock.Object);
        var testMessage = new TestOutboxMessage("Integration Test");

        // Act - First save the message
        await outbox.SaveAsync(testMessage);

        // Verify message is saved but not sent
        var savedMessages = await context.Set<OutboxMessage>().ToListAsync();
        Assert.Single(savedMessages);
        Assert.Null(savedMessages[0].SentAt);

        // Act - Then publish unsent messages
        await outbox.PublishUnsentAsync();

        // Assert - Message should be published
        Assert.Single(publishedMessages);

        // Assert - Message should be marked as sent
        var updatedMessage = await context.Set<OutboxMessage>().FirstAsync();
        Assert.NotNull(updatedMessage.SentAt);
    }

    #endregion

    #region Helpers

    private (IOutbox outbox, Exercise06TestDbContext context) CreateOutbox(IModuleClient? moduleClient = null)
    {
        var options = new DbContextOptionsBuilder<Exercise06TestDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var context = new Exercise06TestDbContext(options);

        var messageContextRegistryMock = new Mock<IMessageContextRegistry>();
        var messageContextProviderMock = new Mock<IMessageContextProvider>();

        messageContextProviderMock
            .Setup(x => x.Get(It.IsAny<IMessage>()))
            .Returns<IMessage>(msg => new MessageContext(
                Guid.NewGuid(),
                new Context(Guid.NewGuid(), string.Empty, new IdentityContext((Guid?)null))));

        var clockMock = new Mock<IClock>();
        clockMock.Setup(x => x.CurrentDate()).Returns(_testTime.AddMinutes(5));

        var moduleClientMock = moduleClient != null
            ? Mock.Get(moduleClient)
            : new Mock<IModuleClient>();

        var asyncDispatcherMock = new Mock<IAsyncMessageDispatcher>();

        var jsonSerializer = new SystemTextJsonSerializer();

        var messagingOptions = Options.Create(new MessagingOptions { UseAsyncDispatcher = false });
        var outboxOptions = Options.Create(new OutboxOptions { Enabled = true });

        var logger = NullLogger<EfOutbox<Exercise06TestDbContext>>.Instance;

        var outbox = new EfOutbox<Exercise06TestDbContext>(
            context,
            messageContextRegistryMock.Object,
            messageContextProviderMock.Object,
            clockMock.Object,
            moduleClientMock.Object,
            asyncDispatcherMock.Object,
            jsonSerializer,
            messagingOptions,
            outboxOptions,
            logger
        );

        return (outbox, context);
    }

    #endregion
}

// Test message class - must be public for serialization
public record TestOutboxMessage(string Content) : IMessage;

// Test DbContext - must be public for generic type constraint
public class Exercise06TestDbContext : DbContext
{
    public Exercise06TestDbContext(DbContextOptions<Exercise06TestDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OutboxMessage>(entity =>
        {
            entity.ToTable("OutboxMessages");
            entity.HasKey(x => x.Id);
        });
    }
}
