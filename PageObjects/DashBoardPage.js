class DashBoardPage
{
    constructor(page)
    {
        this.products = page.locator(".card-body");
        this.productsText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']");
        this.page = page;
    }

    async searchProductAddToCart(productName)
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