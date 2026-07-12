using System.Runtime.CompilerServices;
using System.Text;

namespace TraceDemo;

public static class Hot
{
    public static long BuildReport(int fibRounds, int labelRows, int checksumRows)
    {
        long acc = 0;
        acc += SumOfFib(fibRounds);
        acc += BuildLabels(labelRows);
        acc += ChecksumRows(checksumRows);
        return acc;
    }

    [MethodImpl(MethodImplOptions.NoInlining)]
    private static long SumOfFib(int rounds)
    {
        long sum = 0;
        for (var i = 0; i < rounds; i++)
        {
            sum += SlowFib(13 + (i % 3));
        }

        return sum;
    }

    [MethodImpl(MethodImplOptions.NoInlining)]
    private static long SlowFib(int n)
    {
        if (n < 2)
        {
            return n;
        }

        return SlowFib(n - 1) + SlowFib(n - 2);
    }

    [MethodImpl(MethodImplOptions.NoInlining)]
    private static long BuildLabels(int rows)
    {
        var sb = new StringBuilder();
        long total = 0;
        for (var i = 0; i < rows; i++)
        {
            sb.Clear();
            sb.Append("row-").Append(i).Append('-').Append(i * 2654435761L % 97);
            total += sb.Length;
        }

        return total;
    }

    [MethodImpl(MethodImplOptions.NoInlining)]
    private static long ChecksumRows(int rows)
    {
        long h = 17;
        for (var i = 0; i < rows; i++)
        {
            h = (h * 31 + i) ^ (h >> 3);
        }

        return h;
    }
}
