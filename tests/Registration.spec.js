const {test, expect} = require('@playwright/test');
//const { text } = require('node:stream/consumers');

test('User Registration Scenario', {tag: ['@smokeTest']}, async ({page})=>
{

//Playwright code goes here
await page.goto('https://rahulshettyacademy.com/client/');
await page.locator(".login-wrapper-footer-text").click();
await page.locator("#firstName").fill("Manishi");
await page.locator("#lastName").fill("Shah");
await page.locator("#userEmail").fill("manishishah1992@yahoo.com");
await page.locator("#userMobile").fill("9000000006");
await page.locator("[formcontrolname='occupation']").selectOption('Engineer');
await page.locator("[formcontrolname='gender']").first().click();
await page.locator("#userPassword").fill("Test@12345");
await page.locator("#confirmPassword").fill("Test@12345");
await page.locator("[type='checkbox']").click();
await page.locator("[type='submit']").click();
await expect(page.locator("[class*='headcolor']")).toHaveText("Account Created Successfully");
await page.locator("[class*='btn-primary']").click();

}); 