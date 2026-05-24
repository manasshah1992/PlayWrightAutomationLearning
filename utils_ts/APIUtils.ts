import { test,expect, Locator, Page } from '@playwright/test';


export class APIUtils
{
    apiContext: any;
    loginPayload: string;
    constructor(apiContext: any, loginPayload: string)
    {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }
        async getToken()
        {
            const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
                    {data:this.loginPayload});
            
                expect(loginResponse.ok()).toBeTruthy();
                const loginResponseJson = await loginResponse.json();
                const token = loginResponseJson.token;
                console.log(token);
                return token;
        }

        async createOrder(orderPayload: string)
        {
            
            let response : {token : string; orderId: string} = {token: "", orderId: ""};
            response.token = await this.getToken();
            const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: orderPayload,
            headers: {
                "Authorization": response.token,
                "Content-Type": "application/json"
            }
        });

        const orderResponseJson = await orderResponse.json();
        console.log(orderResponseJson);
        const orderId = orderResponseJson.orders[0];
        response.orderId = orderId;
        return response;
        }
}

module.exports = {APIUtils};