using System.Diagnostics;
using Exercises.Async;
using Xunit;

namespace Exercises.Tests.Async;

public class MorningDashboardTests
{
    [Fact]
    public async Task BeansLabelAsync_composes_the_label_from_the_fetched_value()
    {
        var dashboard = new MorningDashboard();

        Assert.Equal("Ziarna: 12 kg", await dashboard.BeansLabelAsync());
    }

    [Fact]
    public async Task LoadSummaryAsync_composes_all_three_values()
    {
        var dashboard = new MorningDashboard();

        Assert.Equal(
            "Ziarna: 12 kg | Mleko: 3.20 zł | Ocena: 4.8",
            await dashboard.LoadSummaryAsync());
    }

    [Fact]
    public async Task LoadSummaryAsync_runs_the_sources_in_parallel()
    {
        var dashboard = new MorningDashboard();
        var stopwatch = Stopwatch.StartNew();

        await dashboard.LoadSummaryAsync();

        stopwatch.Stop();
        // Sekwencyjnie: ~150 ms (3 x 50). Równolegle: ~50 ms.
        Assert.True(stopwatch.ElapsedMilliseconds < 120,
            $"Trzy źródła po 50 ms zajęły {stopwatch.ElapsedMilliseconds} ms - odpal je równolegle (Task.WhenAll).");
    }

    [Fact]
    public async Task WaitForDeliveryAsync_can_be_cancelled()
    {
        var dashboard = new MorningDashboard();
        using var cts = new CancellationTokenSource(TimeSpan.FromMilliseconds(20));

        await Assert.ThrowsAnyAsync<OperationCanceledException>(
            () => dashboard.WaitForDeliveryAsync(cts.Token));
    }
}
