using System.Diagnostics;

namespace Shop.Api.Infrastructure;

// Endpointy demo do slajdu „JEDEN PROCES NA ŻYWO" (sekcja DI / model wykonania).
public static class ConcurrencyDemo
{
    private static int _hits;
    private static int _inFlight;

    public static void MapConcurrencyDemo(this WebApplication app)
    {
        app.MapGet("/demo", () => Results.Content(DemoPage, "text/html; charset=utf-8"));

        app.MapGet("/demo/hits", () => Results.Ok(new { hits = Interlocked.Increment(ref _hits), pid = Environment.ProcessId }));

        app.MapGet("/demo/threads", () => Results.Ok(new { threadCount = ThreadPool.ThreadCount, inFlight = Volatile.Read(ref _inFlight) }));

        app.MapGet("/demo/storm", async (string mode, int? n) =>
        {
            var count = n ?? 200;
            var sw = Stopwatch.StartNew();
            if (mode == "block")
                await Task.WhenAll(Enumerable.Range(0, count).Select(_ => Task.Run(() =>
                {
                    Interlocked.Increment(ref _inFlight);
                    Thread.Sleep(1000);
                    Interlocked.Decrement(ref _inFlight);
                })));
            else
                await Task.WhenAll(Enumerable.Range(0, count).Select(async _ =>
                {
                    Interlocked.Increment(ref _inFlight);
                    await Task.Delay(1000);
                    Interlocked.Decrement(ref _inFlight);
                }));
            return Results.Ok(new { mode, count, elapsedMs = sw.ElapsedMilliseconds, threadCount = ThreadPool.ThreadCount });
        });

        app.MapGet("/demo/block", () =>
        {
            Thread.Sleep(1000);
            return Results.Ok(new { mode = "block" });
        });

        app.MapGet("/demo/async", async () =>
        {
            await Task.Delay(1000);
            return Results.Ok(new { mode = "async" });
        });
    }

    private const string DemoPage = """
        <!doctype html>
        <html lang="pl">
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>JEDEN PROCES — na żywo</title>
        <style>
        body{font-family:system-ui,-apple-system,sans-serif;background:#0d1117;color:#e6edf3;margin:0;padding:40px;text-align:center}
        h1{font-weight:600;letter-spacing:.01em}
        .meters{display:flex;gap:22px;justify-content:center;margin:30px 0 22px;flex-wrap:wrap}
        .m{background:#161b22;border:1px solid #30363d;border-radius:14px;padding:22px 34px;min-width:210px}
        .m .v{font-size:60px;font-weight:700;font-variant-numeric:tabular-nums;line-height:1}
        .m .l{font-size:12px;color:#8b949e;text-transform:uppercase;letter-spacing:.09em;margin-top:12px}
        .hot .v{color:#f85149}
        .grid{display:grid;grid-template-columns:repeat(20,1fr);gap:5px;max-width:600px;margin:0 auto 8px}
        .cell{aspect-ratio:1;border-radius:3px;background:#21262d;border:1px solid #30363d;transition:background .08s,border-color .08s}
        .cell.on{background:#58a6ff;border-color:#58a6ff}
        .cell.block.on{background:#f85149;border-color:#f85149}
        .cell.async.on{background:#3fb950;border-color:#3fb950}
        .gridlbl{font-size:13px;color:#8b949e;letter-spacing:.04em;margin-bottom:26px}
        button{font-size:19px;padding:16px 26px;margin:8px;border-radius:11px;border:1px solid #30363d;cursor:pointer;background:#21262d;color:#e6edf3}
        button:hover:not(:disabled){border-color:#8b949e}
        button:disabled{opacity:.45;cursor:default}
        .block{border-color:#f85149}
        .async{border-color:#3fb950}
        .results{margin-top:18px;font-size:17px;color:#8b949e}
        .results span{margin:0 14px}
        #log{margin-top:22px;font-size:16px;color:#8b949e;min-height:26px}
        b.r{color:#f85149} b.g{color:#3fb950}
        </style>
        </head>
        <body>
        <h1>JEDEN PROCES — pula wątków na żywo</h1>
        <div class="meters">
          <div class="m" id="tc"><div class="v">–</div><div class="l">ThreadPool.ThreadCount</div></div>
          <div class="m" id="lat"><div class="v">–</div><div class="l">canary /demo/threads [ms]</div></div>
        </div>
        <div class="grid" id="grid"></div>
        <div class="gridlbl">tasks in flight — <b id="ifn">0</b> / 200 · kwadrat = 1 zadanie w locie</div>
        <div>
          <button class="block" onclick="storm('block',this)">🧱 blocking flood ×200</button>
          <button class="async" onclick="storm('async',this)">⚡ async flood ×200</button>
        </div>
        <div class="results">
          <span>🧱 block: <b class="r" id="rB">–</b></span>
          <span>⚡ async: <b class="g" id="rA">–</b></span>
        </div>
        <div id="log">Klik → serwer odpala 200 równoległych zadań. Patrz na siatkę, ThreadCount i canary.</div>
        <script>
        let base=null, curMode='';
        const $=s=>document.querySelector(s);
        const tcV=$('#tc .v'), latV=$('#lat .v'), tcM=$('#tc'), latM=$('#lat'),
              rB=$('#rB'), rA=$('#rA'), log=$('#log'), grid=$('#grid'), ifn=$('#ifn');
        const cells=[];
        for(let i=0;i<200;i++){ const d=document.createElement('div'); d.className='cell'; grid.appendChild(d); cells.push(d); }
        function paint(k){
          ifn.textContent=k;
          for(let i=0;i<cells.length;i++){
            const c=cells[i];
            c.classList.toggle('on', i<k);
            c.classList.toggle('block', curMode==='block');
            c.classList.toggle('async', curMode==='async');
          }
        }
        async function poll(){
          const t=performance.now();
          try{
            const r=await fetch('/demo/threads'); const j=await r.json();
            const ms=Math.round(performance.now()-t);
            if(base===null) base=j.threadCount;
            tcV.textContent=j.threadCount; latV.textContent=ms;
            tcM.classList.toggle('hot', j.threadCount>base+3);
            latM.classList.toggle('hot', ms>150);
            paint(j.inFlight||0);
          }catch(e){ latV.textContent='—'; latM.classList.add('hot'); }
          setTimeout(poll,150);
        }
        poll();
        async function storm(mode,btn){
          curMode=mode;
          document.querySelectorAll('button').forEach(b=>b.disabled=true);
          log.textContent='⏳ 200 × '+mode+' leci na serwerze… (patrz siatkę i liczniki)';
          try{
            const r=await fetch('/demo/storm?mode='+mode+'&n=200'); const j=await r.json();
            (mode==='block'?rB:rA).textContent=j.elapsedMs+' ms';
            log.innerHTML='✅ '+mode+' → <b class="'+(mode==='async'?'g':'r')+'">'+j.elapsedMs+' ms</b> łącznie, ThreadCount po flood: '+j.threadCount;
          }catch(e){ log.textContent='błąd: '+e; }
          document.querySelectorAll('button').forEach(b=>b.disabled=false);
        }
        </script>
        </body>
        </html>
        """;
}
