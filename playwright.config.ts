import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // globalSetup: './tests/e2e/auth.setup',
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',
    // baseURL: 'https://datahub.prod.uktrade.digital',
    baseURL: 'https://datahub.prod.uktrade.digital',
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    /**
     * This "project" contains only a single test which doesn't test anything,
     * but opens a browser where we can manually go through the SSO OAuth flow,
     * at the end of which, the test preserves the session (cookies) in the
     * ./.auth/user.json file
     */
    {
      name: 'auth',
      testMatch: 'auth.ts',
      timeout: 1000 * 60 * 100,
    },
    {
      name: 'foo',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'], 
        storageState: './.auth/user.json',
      },
      /**
       * We make the "auth" project a dependency of this project.
       * The Playwright UI allows turning projects on and off.
       * When we run this project for the first time,
       * it will run "auth" first so we can manually go through the OAuth flow.
       * After the OAuth flow succeeds, the tests in this project will be run with
       * the authenticated context.
       * If we run the tests again, we will have to go through the OAuth flow again,
       * but we can toggle the "auth" project off in the UI and we can only run
       * tests in this project still with the authenticated context.
       * Should our session expire, we can just toggle "auth" back on and
       * go through the OAuth flow again.
       * Or alternatively, we can manually add a record for the "datahub.sid"
       * session cookie to the ./.auth/user.json file? 
       */
      dependencies: ['auth'],
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
