const {test, expect} = require('@playwright/test');


test('Network interception using Request', {tag: ['@API']}, async ({page})=>
{
const email = 'manasshah1992@yahoo.com';
const ProductName = 'ZARA COAT 3';
const products = page.locator(".card-body");

//Login steps
await page.goto('https://rahulshettyacademy.com/client/');
await page.locator("#userEmail").fill(email);
await page.locator("#userPassword").fill("Test@123");
await page.locator("[type='submit']").click();
await page.waitForLoadState('networkidle');
await page.locator(".card-body b").first().waitFor();
await page.locator("button[routerlink*='myorders']").click();
await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
     route=> route.continue({
      url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6"  
     })
);
await page.locator("button:has-text('View')").first().click();
//await page.pause();
await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");

});