// @ts-check
import { defineConfig, devices } from '@playwright/test';


/**
 * @see https://playwright.dev/docs/test-configuration
 */

const config = ({
  testDir: './tests',
  timeout: 50000, // Overall timeout for each test
  /* Run tests in files in parallel */
  expect: {
    timeout: 5000, // Timeout for each expect assertion
  },

  //fullyParallel: true,
  reporter: 'html',
  
  use: {
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    trace: 'on',
    video: 'retain-on-failure'
    
  },

  /* Configure projects for major browsers */
  
});

module.exports = config

