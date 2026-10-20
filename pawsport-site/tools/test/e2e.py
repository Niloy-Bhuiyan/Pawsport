import sys, json
from playwright.sync_api import sync_playwright
BASE='http://localhost:3100'
ROUTES=['/','/destinations','/plan-builder','/how-it-works','/pricing','/for-teams','/partners','/resources','/portal','/contact','/start','/start/quick','/start/documents','/arrival','/for-teams/demo','/partners/apply','/privacy','/terms']
SH='/tmp/claude-0/-home-claude/64ffe4ce-9437-5a38-a20b-203a3b461af2/scratchpad/pawsport-site/shots'
import os; os.makedirs(SH,exist_ok=True)
sel=sys.argv[1:] or ROUTES
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    for r in sel:
        for mode,(w,h,ua) in {'d':(1440,900,None),'m':(390,844,'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148')}.items():
            ctx=b.new_context(viewport={'width':w,'height':h},user_agent=ua) if ua else b.new_context(viewport={'width':w,'height':h})
            pg=ctx.new_page(); errs=[]
            pg.on('console',lambda m: errs.append(m.text[:200]) if m.type in('error','warning') else None)
            pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)[:200]))
            resp=pg.goto(BASE+r,wait_until='networkidle')
            pg.wait_for_timeout(1200)
            ph=pg.evaluate("document.documentElement.scrollHeight")
            n=r.strip('/').replace('/','_') or 'home'
            pg.screenshot(path=f'{SH}/{n}-{mode}.png',full_page=False)
            print(r,mode,resp.status,'h',ph,'errs',len(errs), errs[:3])
            ctx.close()
    b.close()
