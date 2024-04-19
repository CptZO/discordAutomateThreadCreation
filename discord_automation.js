require('dotenv').config(); 
const { chromium } = require('playwright');
const { authenticator } = require('otplib'); // for two fact Auth

(async () => {

    const browser = await chromium.launch({ headless: false, slowMo: 1000 }); //Added head mode for Ui and slowMO for debugging 
    const page = await browser.newPage(); // Open a new page

    try {
        await page.goto('https://discord.com/login', { timeout: 30000 });
    
        // Check if already logged in by looking for a element visible only when logged in

        if (await page.isVisible('[aria-label="Private channels"]', { timeout: 5000 })) {
            console.log('Already logged in');
        } else {

            // Perform login
            await page.fill('input[name="email"]', process.env.DISCORD_EMAIL);
            await page.fill('input[name="password"]', process.env.DISCORD_PASSWORD);
            await page.click('button[type="submit"]')
            
            // Handles for Two fact auth
            if (await page.isVisible('input[placeholder="6-digit authentication code"]', { timeout: 5000 })) {
                const code = authenticator.generate(process.env.TOTP_SECRET);
                console.log("Generated TOTP Code:", code);
                await page.fill('input[placeholder="6-digit authentication code"]', code);
                await page.click('button[type="submit"]');
                await page.waitForURL('https://discord.com/channels/@me', { timeout: 30000 });
            }
    
            // Checks for sucessful login using waitForURL
            await Promise.all([
                page.waitForURL('https://discord.com/channels/@me', { timeout: 30000 }),
                page.isVisible('[aria-label="Private channels"]'),
            ]);
            
            console.log('Login successful.');

            // Click the search bar using its class and fill in the server name
            await page.click('.searchBarComponent__8f95f');
            await page.fill('input[aria-label="Quick switcher"]', process.env.DISCORD_SERVER_NAME);

            // Wait for the server name to show up in search results and click it
            await page.waitForSelector(`text="${process.env.DISCORD_SERVER_NAME}"`);
            await page.click(`text="${process.env.DISCORD_SERVER_NAME}"`);
            
            // Click on the Threads button
            await page.click('[aria-label="Threads"]');

            // Wait until the Threads popout is expanded
            await page.waitForSelector('[aria-label="Threads"][aria-expanded="true"]');

            // Wait for the Create button inside the Threads popout
            await page.waitForSelector('text="Create"', { state: 'visible' });
            await page.click('text="Create"'); 
            

        }
    } catch (error) {
        console.error(`Login test failed: ${error.message}`);
        await page.screenshot({ path: 'login-failure.png' }); // screenshot on error
        throw error; 
    } finally {
        await browser.close();
    }
})();
