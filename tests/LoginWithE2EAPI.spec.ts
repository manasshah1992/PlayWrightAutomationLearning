import {test, expect, request, Page} from '@playwright/test';
import {APIUtils} from '../utils_ts/APIUtils';
let loginPayload : any = {userEmail: "manasshah1992@yahoo.com", userPassword: "Test@123"};
let orderPayload : any = {orders: [{country: "India", productOrderedId: "6960eac0c941646b7a8b3e68"}]}
let response: any;

test.beforeAll(async ()=>
{
    //Login API
    const apiContext = await request.newContext({ignoreHTTPSErrors:true});
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
    
    //Place order API

});


test('Login and Place the Order using API',{tag: ['@API', '@Regression']}, async ({page})=>
{
    
    await page.addInitScript(value =>{
    window.localStorage.setItem("token",value);
    }, response.token);


await page.goto('https://rahulshettyacademy.com/client/');


await page.locator("button[routerlink*='myorders']").click();
await page.locator("tbody").waitFor();

const rows = await page.locator("tbody tr");

for(let i=0;i<await rows.count();i++)
{
const rowOrderId = await rows.nth(i).locator("th").textContent();
if(response.orderId.includes(rowOrderId))
{
    await rows.nth(i).locator("button").first().click();
}
}

const orderIdDetails =await page.locator(".col-text").textContent();
//await page.pause();
expect(response.orderId.includes(orderIdDetails)).toBeTruthy();

}
);