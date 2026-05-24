import { test,expect, Locator, Page } from '@playwright/test';


export class OrderHistoryAndDetailPage
{
    page: Page;
    ordersTable: Locator;
    rows: Locator;
    orderdIdDetails: Locator;
    orderHIstoryButton: Locator;

    constructor(page: Page)
    {
    this.page = page;
    this.ordersTable = page.locator("tbody").first();
    this.rows = this.ordersTable.locator("tr");
    this.orderdIdDetails =page.locator(".col-text");
    this.orderHIstoryButton = page.locator("button[routerlink*='myorders']");

    }

    async searchOrderAndSelect(orderId: string)
    {
       await this.orderHIstoryButton.click(); 
        await this.ordersTable.waitFor();
        const rows = await this.rows;

        for(let i =0; i<await this.rows.count(); ++i)
        {
            let rowOrderId: any;
            rowOrderId =await this.rows.nth(i).locator("th").textContent();
        if (orderId.includes(rowOrderId))
        {
        await this.rows.nth(i).locator("button").first().click();
        break;
        }
        }
    }

    async getOrderId()
    {
        return await this.orderdIdDetails.textContent();
    }

}

module.exports = {OrderHistoryAndDetailPage};