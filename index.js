const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const randomUseragent = require('random-useragent');
puppeteer.use(StealthPlugin());

puppeteer.launch({ headless: true }).then(async browser => {
    let bypasscomplete = true;
    let cookies;
	let usedAgent;
    while (bypasscomplete) {
        const userAgent = randomUseragent.getRandom();

        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en'
        });
        await page.setUserAgent(userAgent);
        await page.setJavaScriptEnabled(true);
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({
            width: 1920 + Math.floor(Math.random() * 100),
            height: 3000 + Math.floor(Math.random() * 100),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
        });

        console.log('Bypassing Cloudflare...');
        await page.goto('https://nhentai.net/', {
            waitUntil: 'networkidle0',
        });
        await page.waitForTimeout(10000);
        await page.screenshot({ path: 'bypassed.png', fullPage: true });
        cookies = await page.cookies();
        usedAgent = await page.evaluate(() => navigator.userAgent);

        for (i = 0; i < cookies.length; i++) {
            if (cookies[i]?.name === 'cf_clearance') bypasscomplete = false;
        }

        if (bypasscomplete) console.log('Bypass : FALSE | restarting...');
    }
    console.log('Bypassed ! Check the screenshot !');
    console.log('Bypassed ! Check the cookies !', cookies);
    console.log('Bypassed ! Check the userAgent !', usedAgent);
    await browser.close();
});