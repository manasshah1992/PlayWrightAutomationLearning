const {test, expect, request} = require('@playwright/test');
const {APIUtils} = require('../utils/APIUtils');
const loginPayload = {userEmail: "manasshah1992@yahoo.com", userPassword: "Test@123"}
const orderPayload = {orders: [{country: "India", productOrderedId: "6960eac0c941646b7a8b3e68"}]}
const fakeResponse = {data:[],message:"No Orders"};
let response;

test.beforeAll(async ()=>
{
    //Login API
    const apiContext = await request.newContext({ignoreHTTPSErrors:true});
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
    
    //Place order API

});


test('Network interception Response using API', {tag: ['@API']},async ({page})=>
{
    
    await page.addInitScript(value =>{
    window.localStorage.setItem("token",value);
    }, response.token);


await page.goto("https://rahulshettyacademy.com/client/");
//await page.pause();
await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*", 
    async route=>
{
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fakeResponse),
    });

}
);

await page.locator("button[routerlink*='myorders']").click();
//await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/69ff5b0be83610b531d55ba5");
console.log(await page.locator(".mt-4").textContent());
//await page.pause();

}
);