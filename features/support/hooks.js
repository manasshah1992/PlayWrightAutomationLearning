const { Before, AfterStep } = require("@cucumber/cucumber");
const { chromium } = require('playwright');


Before({tags: "@cucumber"},async function () {
    const browser = await chromium.launch({headless: false});
    const context = await browser.newContext();
    this.page = await context.newPage();

});

AfterStep(async function ({result}) {
if(result.status === "FAILED")
{
    await this.page.screenshot({path: 'screenshot.png'});
}

});
