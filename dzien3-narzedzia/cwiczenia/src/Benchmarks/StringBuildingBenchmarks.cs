using System.Text;
using BenchmarkDotNet.Attributes;

namespace Benchmarks;

[MemoryDiagnoser]
public class StringBuildingBenchmarks
{
    private const int Iterations = 1000;

    [Benchmark(Baseline = true)]
    public string PlusEquals()
    {
        var result = string.Empty;
        for (var i = 0; i < Iterations; i++)
        {
            result += i;
        }

        return result;
    }

    [Benchmark]
    public string StringBuilder()
    {
        var builder = new StringBuilder();
        for (var i = 0; i < Iterations; i++)
        {
            builder.Append(i);
        }

        return builder.ToString();
    }
}
