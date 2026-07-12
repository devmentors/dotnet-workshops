using System.Diagnostics;
using TraceDemo;

Console.WriteLine($"TraceDemo: raport z jedną gorącą ścieżką. PID = {Environment.ProcessId}.");

var sw = Stopwatch.StartNew();
var total = Hot.BuildReport(fibRounds: 750_000, labelRows: 12_000_000, checksumRows: 60_000_000);
sw.Stop();

Console.WriteLine($"Raport = {total} w {sw.ElapsedMilliseconds} ms.");
