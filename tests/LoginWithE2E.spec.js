const {test, expect} = require('@playwright/test');


test('User Login with E2E Scenario Basic', {tag: ['@Regression']}, async ({page})=>
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
//await page.locator(".card-body b").first().waitFor();
const title = await page.locator(".card-body b").allTextContents();
console.log(title);

// Add to cart steps
const count = await products.count();

for(let i=0;i<count;i++)
{
if(await products.nth(i).locator("b").textContent() === ProductName)
{
await products.nth(i).locator("text= Add To Cart").click();
break;
}
}

await page.locator("[routerlink*='cart']").click();
await page.locator("div li").first().waitFor();
const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
expect(bool).toBeTruthy();
await page.locator("text=Checkout").click();

//Checkout page
await page.locator("[class='input txt']").first().fill("476");
await page.locator("[class='input txt']").last().fill("Manas Shah");
await page.locator("[name='coupon']").fill("rahulshettyacademy");
await page.locator(".btn-primary").click();

await expect(page.locator("[style*='color: green']")).toHaveText("* Coupon Applied");
expect(page.locator(".user__name [type='text']").first()).toHaveText(email);

await page.locator("[placeholder*='Country']").pressSequentially("ind");
const dropdown = page.locator(".ta-results");
await dropdown.waitFor();
const optionsCount = await dropdown.locator("button").count();
for(let i=0;i<optionsCount;i++)
{
if(await dropdown.locator("button").nth(i).textContent() === " India")
    {
    await dropdown.locator("button").nth(i).click();
    break;
    } 
}

await page.locator(".action__submit").click();
await expect (page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
console.log(orderId);

// Order history page
await page.locator("button[routerlink*='myorders']").click();
await page.locator("tbody").waitFor();

const rows = await page.locator("tbody tr");

for(let i=0;i<await rows.count();i++)
{
const rowOrderId = await rows.nth(i).locator("th").textContent();
if(orderId.includes(rowOrderId))
{
    await rows.nth(i).locator("button").first().click();
}
}

const orderIdDetails =await page.locator(".col-text").textContent();
expect(orderId.includes(orderIdDetails)).toBeTruthy();
//await page.pause();

}
);

test('Page Playwright Test', {tag: ['@Regression']}, async ({page})=>
{

await page.goto('https://www.google.com');
console.log(await page.title());
await expect(page).toHaveTitle('Google');
});