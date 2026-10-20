import sys
from playwright.sync_api import sync_playwright
def walker(name, mode, n):
    def f(pg):
        d = mode=='d'
        base = '.pg .lf:not(.t) .fr' if d else '.pg .pgm:not(.gone)'
        if pg.locator('input[type=file]').count(): pg.set_input_files('input[type=file]', {'name':'rabies-card.pdf','mimeType':'application/pdf','buffer':b'x'})
        pg.click('.pg .cvi .btn >> visible=true'); pg.wait_for_timeout(1800)
        for k in range(1, n+1):
            cur = pg.locator('.pg .lf:not(.t)').first.locator('.fr') if d else pg.locator('.pg .pgm:not(.gone)').first
            # text inputs
            ins = cur.locator('input'); 
            for j in range(ins.count()):
                t = ins.nth(j).get_attribute('type') or 'text'
                if t=='file': continue
                v = {'email':'niya@mail.com','tel':'+8801700000000','date':'2027-03-20'}.get(t,'Test value')
                ins.nth(j).fill(v); ins.nth(j).dispatch_event('change')
            ta = cur.locator('textarea')
            for j in range(ta.count()):
                ta.nth(j).fill('Great trip'); ta.nth(j).dispatch_event('change')
            for sel in ['.xqb','.xcard','.xchip2']:
                c = cur.locator(sel)
                if c.count(): c.first.click()
            groups = cur.locator('.fld')
            for j in range(groups.count()):
                c = groups.nth(j).locator('.xd, .seg button, .xpaw')
                if c.count():
                    try: c.nth(min(3,c.count()-1) if 'xpaw' in (c.first.get_attribute('class') or '') else 0).click(timeout=800)
                    except Exception as e: pass
            cons = cur.locator('.cons')
            for j in range(cons.count()):
                try: cons.nth(j).locator('.bx').click(timeout=800)
                except Exception: pass
            tr = cur.locator('.xtri')
            pg.wait_for_timeout(300)
            pg.screenshot(path=f'shots/W{name}{mode}_{k:02d}.png')
            pay = cur.locator('text=Pay $')
            if pay.count(): pay.first.click()
            btn = cur.locator('.acts .btn.r')
            dis = btn.first.get_attribute('disabled', timeout=3000)
            if dis is not None: print(name, mode, 'page', k, 'NEXT DISABLED'); break
            btn.first.click(); pg.wait_for_timeout(2300)
        pg.wait_for_timeout(600)
        pg.screenshot(path=f'shots/W{name}{mode}_end.png')
    return f

UAM='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'
if __name__=='__main__':
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        for route,name,n in [('/start','Intake',13),('/start/quick','Quick',3),('/start/documents','Upload',4),('/arrival','Arrival',6),('/for-teams/demo','TeamDemo',6),('/partners/apply','PartnerApp',5)]:
            for mode in 'dm':
                ctx=b.new_context(viewport={'width':1440,'height':900}) if mode=='d' else b.new_context(viewport={'width':390,'height':844},user_agent=UAM)
                pg=ctx.new_page(); errs=[]
                pg.on('pageerror',lambda e: errs.append(str(e)[:200]))
                pg.on('console',lambda m: errs.append(m.text[:200]) if m.type=='error' else None)
                pg.goto('http://localhost:3100'+route,wait_until='networkidle'); pg.wait_for_timeout(1500)
                try: walker(name,mode,n)(pg)
                except Exception as e: print(name,mode,'EXC',str(e)[:200])
                print(name,mode,'errs',errs[:2])
                ctx.close()
        b.close()
