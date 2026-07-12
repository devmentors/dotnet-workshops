using Greetings;

var name = args.Length > 0 ? args[0] : "świecie";
Console.WriteLine(Greeter.Hello(name));
