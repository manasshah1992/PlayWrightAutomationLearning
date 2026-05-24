
  

  
  // @ts-check
import { defineConfig, devices } from '@playwright/test';


/**
 * @see https://playwright.dev/docs/test-configuration
 */

const config = ({
  testDir: './tests',
  timeout: 30000, // Overall timeout for each test
  /* Run tests in files in parallel */
  expect: {
    timeout: 5000, // Timeout for each expect assertion
  },
  reporter: 'html',
  use: {
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    trace: 'on',
    video: 'retain-on-failure'
    
  },

  projects: [
    {
      name: 'safari',
      use: {
        browserName: 'webkit',
        
        ...devices['iPhone 14'] },
    }
  
  ],

});

module.exports = config