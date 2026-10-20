from playwright.sync_api import sync_playwright
BASE='http://localhost:3100'
SH='/tmp/claude-0/-home-claude/64ffe4ce-9437-5a38-a20b-203a3b461af2/scratchpad/pawsport-site/shots'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    # hydration under a different timezone/locale
    ctx=b.new_context(viewport={'width':1440,'height':900},timezone_id='Asia/Dhaka',locale='en-GB')
    for r in ['/plan-builder','/start','/start/quick','/contact','/portal','/resources','/destinations']:
        pg=ctx.new_page(); errs=[]
        pg.on('console',lambda m: errs.append(m.text[:300]) if m.type in('error','warning') else None)
        pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)[:300]))
        pg.goto(BASE+r,wait_until='networkidle'); pg.wait_for_timeout(800)
        print('tz',r,errs[:3]); pg.close()
    # chat
    pg=ctx.new_page(); errs=[]
    pg.on('pageerror',lambda e: errs.append(str(e)[:200]))
    pg.goto(BASE+'/pricing',wait_until='networkidle'); pg.wait_for_timeout(600)
    pg.click('.chbtn',force=True); pg.wait_for_timeout(900)
    pg.click('text=How does it work?',force=True); pg.wait_for_timeout(2200)
    pg.screenshot(path=SH+'/chat-d.png')
    print('chat msgs',pg.locator('.chw .chp').inner_text()[:300].replace('\n',' | '), errs)
    b.close()
