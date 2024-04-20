const { test, expect } = require('@playwright/test');
require('dotenv').config();
const { authenticator } = require('otplib');

test('Discord login', async ({ page }) => {
    await page.goto('https://discord.com/login', { timeout: 30000 });

    if (await page.isVisible('[aria-label="Private channels"]', { timeout: 5000 })) {
        console.log('Already logged in');
    } else {
        await page.fill('input[name="email"]', process.env.DISCORD_EMAIL);
        await page.fill('input[name="password"]', process.env.DISCORD_PASSWORD);
        await page.click('button[type="submit"]');

        await page.waitForSelector('input[placeholder="6-digit authentication code"], [aria-label="Private channels"]', { state: 'visible', timeout: 30000 });

        if (await page.isVisible('input[placeholder="6-digit authentication code"]', { timeout: 5000 })) {
            const code = authenticator.generate(process.env.TOTP_SECRET);
            console.log("Generated TOTP Code:", code);
            await page.fill('input[placeholder="6-digit authentication code"]', code);
            await page.click('button[type="submit"]');
        }

        await page.waitForURL('https://discord.com/channels/@me', { timeout: 30000 });
        const privateChannelsLocator = page.locator('[aria-label="Private channels"]');
        await expect(privateChannelsLocator).toBeVisible();

        console.log('Login successful.');
    }
});
