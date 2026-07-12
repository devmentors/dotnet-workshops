namespace Packable;

public sealed record SemanticVersion(int Major, int Minor, int Patch) : IComparable<SemanticVersion>
{
    public static SemanticVersion Parse(string text)
    {
        throw new NotImplementedException("Zaimplementuj Parse (06_NUGET).");
    }

    public int CompareTo(SemanticVersion? other)
    {
        throw new NotImplementedException("Zaimplementuj CompareTo (06_NUGET).");
    }
}
