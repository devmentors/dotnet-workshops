using Packable;

var slug = SlugGenerator.Slugify("Hello, World!");
Console.WriteLine($"Slugify(\"Hello, World!\") = {slug}");

var version = SemanticVersion.Parse("1.2.3");
Console.WriteLine($"SemanticVersion.Parse(\"1.2.3\") = {version.Major}.{version.Minor}.{version.Patch}");

var older = SemanticVersion.Parse("1.2.0");
var newer = SemanticVersion.Parse("1.10.0");
Console.WriteLine($"1.2.0 < 1.10.0 ? {older.CompareTo(newer) < 0}");
