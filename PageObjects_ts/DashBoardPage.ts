import { test,expect, Locator, Page } from '@playwright/test';

export class DashBoardPage
{
    page: Page;
    products: Locator;
    productsText: Locator;
    cart: Locator;
    constructor(page: Page)
    {
        this.products = page.locator(".card-body");
        this.productsText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']");
        this.page = page;
    }

    async searchProductAddToCart(productName: string)
    {
        
        //await page.locator(".card-body b").first().waitFor();
        const title = await this.productsText.allTextContents();
        console.log(title);

        // Add to cart steps
        const count = await this.products.count();

        for(let i=0;i<count;i++)
        {
            if(await this.products.nth(i).locator("b").textContent() === productName)
            {
                await this.products.nth(i).locator("text= Add To Cart").click();
                break;
            }
        }

    }

    async goToCart()
    {
        await this.cart.click();

    }
}

module.exports = {DashBoardPage};