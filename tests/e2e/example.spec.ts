import { test, expect } from '@playwright/test';

test('has title', async ({ browser }) => {

  // Create a new incognito browser context
  // const context = await browser.newContext();
  // // context.setDefaultTimeout(0);
  // // Create a new page inside context.
  // const page = await context.newPage();
  // await page.goto('/');

  // Create a new incognito browser context
  const context = await browser.newContext();
  context.setDefaultNavigationTimeout(0)
  context.setDefaultTimeout(0)
  // Create a new page inside context.
  const page = await context.newPage();
  await page.goto('/');
  await page.fill('input[name="email"]', 'marijn.kampf@digital.trade.gov.uk');
  await page.click('input[value ="Next step"]');
  await expect(page.getByRole('button', { value: 'Log in'})).toBeVisible()
  await page.click('input[value="Log in"]');
  // page.click()
  await expect(page.getByRole('button', { name: 'Data hub'})).toBeVisible({ timeout: 200000 });
  // Dispose context once it's no longer needed.
  await context.close();


  // @pytest.fixture(scope="session")
  // def context(browser, session_data):
  //     """Create a new browser context."""
  //     context = browser.new_context()
  //     context.set_default_timeout(0)  
  
  // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/DataHub/);

  // await context.close();
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
