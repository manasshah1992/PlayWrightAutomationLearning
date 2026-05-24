class OrderHistoryAndDetailPage
{

    constructor(page)
    {
    this.page = page;
    this.ordersTable = page.locator("tbody").first();
    this.rows = this.ordersTable.locator("tr");
    this.orderdIdDetails =page.locator(".col-text");
    this.orderHIstoryButton = page.locator("button[routerlink*='myorders']");

    }

    async searchOrderAndSelect(orderId)
    {
       await this.orderHIstoryButton.click(); 
        await this.ordersTable.waitFor();
        const rows = await this.rows;

        for(let i =0; i<await this.rows.count(); ++i)
        {
        const rowOrderId =await this.rows.nth(i).locator("th").textContent();
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