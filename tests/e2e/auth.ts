import { chromium, test } from "playwright/test"
import fs from 'node:fs'

const authFile = './.auth/user.json'

test('auth', async () => {
  /**
   * We are using the low-level browser API here,
   * which allows us to interact with the page.
   * The normal testing API prevents form sumbission and link navigation
   */
  const browser = await chromium.launch({headless: false})
  const context = await browser.newContext()
  const page = await context.newPage()

  // If authFile exists use details.
  // If tests fail remove auth file and the script below will induce the SSO login screen 
  // and generate a new one.
  if (!fs.existsSync(authFile)) {
    // (await page.context().storageState()).cookies

    // Induce the SSO screen
    // We are expecting to be redirected to SSO
    await page.goto('/')
    // This is here to force playwright to stop at the SSO page,
    // because in the next step we are gonna make it wait for the URL we are already on...
    await page.getByLabel('Next step')
    // ...now we wait to be redirected back from SSO
    await page.waitForURL('/')
    // Finally we preserve the authenticated page context,
    // which we will reuse in subsequent tests
    await page.context().storageState({ path: authFile });
  }
})