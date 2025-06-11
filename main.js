const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs');
const path = require('path');
const ProxyChain = require('proxy-chain');

chromium.use(StealthPlugin);

const PROFILE_DIR = path.join(__dirname, 'carfax-profile');

class CarfaxAutomator {
  constructor({ loginIfNeeded = false } = {}) {  // Change here if needed 
    this.browser = null;
    this.page = null;
    this.loginIfNeeded = loginIfNeeded;
    this.username = process.env.CARFAX_USERNAME || 'YOUR_EMAIL';
    this.password = process.env.CARFAX_PASSWORD || 'YOUR_PASSWORD';
  }

  async loginIfRequired() {
    // Go to landing page
    await this.page.goto('https://www.carfaxonline.com/landingPage', { waitUntil: 'domcontentloaded' });
    // Click Sign In or go directly to /login
    try {
      await this.page.click('#landing_signin_item-link', { timeout: 5000 });
      await this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 });
    } catch {
      await this.page.goto('https://www.carfaxonline.com/login', { waitUntil: 'domcontentloaded' });
    }
    // Fill in credentials
    await this.page.fill('#username', this.username);
    await this.page.fill('#password', this.password);
    // Click Log In
    await this.page.click('button[type="submit"]');
    // Wait for login to complete (e.g., check for VIN input)
    await this.page.waitForSelector('#vin', { timeout: 15000 });
  }

  async initialize() {
    try {
      const server = new ProxyChain.Server({ port: 8000 });
      server.listen(() => console.log(`🔌 Proxy server running on 8000`));

      console.log('🚀 Connecting to Chrome over CDP...');
      this.browser = await chromium.connectOverCDP('http://localhost:9223');

      const contexts = this.browser.contexts();
      this.page = contexts.length > 0 ? contexts[0].pages()[0] : await contexts[0].newPage();

      console.log('✅ Browser ready');

      await this.applyStealth();

      if (this.loginIfNeeded) {
        await this.loginIfRequired();
      }

    } catch (err) {
      console.error('❌ Error during initialize:', err);
      throw err;
    }
  }

  async applyStealth() {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
    await this.page.setExtraHTTPHeaders({ 'User-Agent': ua });
    await this.page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', {
        get: () => [{ name: 'Fake Plugin 1' }, { name: 'Fake Plugin 2' }],
      });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    });

    this.page.on('load', async () => {
      await this.page.waitForTimeout(2000);
      await this.page.mouse.move(100 + Math.random() * 500, 100 + Math.random() * 400);
    });
  }

    async getVinReport(vin) {
    const start = Date.now();
    try {
      console.log(`📄 Navigating directly to Carfax VHR page for ${vin}...`);
      await this.page.goto(`https://www.carfaxonline.com/vhr/${vin}`, { waitUntil: 'load', timeout: 30000 });
      
      console.log('⏳ Waiting for key elements to load...');
      // Faster element waiting
      try {
        await this.page.waitForSelector('.history-based-value', { timeout: 5000 });
        await this.page.waitForSelector('#language-toggle', { timeout: 2000 });
        await this.page.waitForSelector('#top-bar', { timeout: 2000 });
        console.log('🎯 All key elements loaded');
      } catch (err) {
        console.log('⚠️ Some elements may not have loaded, proceeding anyway');
      }
      
      // Reduced delay for final rendering
      await new Promise(r => setTimeout(r, 500));
      
      console.log('✅ Page loaded, capturing HTML...');
      const html = await this.page.content();
      
      // ONLY add styling to fix layout - NO JavaScript to interfere with print button
      const styledHtml = html
        .replace(/<head>/, `<head>
          <style>
            /* Make everything wider - simple fix */
            body, html { min-width: 1400px !important; }
            * { max-width: none !important; }
            .container, .content, .main-content, .wrapper, .layout { width: 100% !important; max-width: none !important; }
          </style>`);
      
      const dir = path.join(__dirname, 'reports');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      
      const filename = path.join(dir, `${vin}_${Date.now()}.html`);
      fs.writeFileSync(filename, styledHtml);
  
      console.log(`✅ VIN ${vin} processed in ${(Date.now() - start) / 1000}s`);
      return filename;
    } catch (err) {
      // Take a screenshot on error
      try {
        const errorDir = path.join(__dirname, 'reports', 'errors');
        if (!fs.existsSync(errorDir)) fs.mkdirSync(errorDir, { recursive: true });
        const screenshotPath = path.join(errorDir, `${vin}_${Date.now()}.png`);
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        console.error(`❌ getVinReport failed. Screenshot saved at: ${screenshotPath}`);
      } catch (screenshotErr) {
        console.error('❌ Failed to capture screenshot on error:', screenshotErr);
      }
      console.error(`❌ getVinReport failed:`, err);
      throw err;
    }
  }

  async close() {
    if (this.browser) await this.browser.close();
  }
}

module.exports = { CarfaxAutomator };
