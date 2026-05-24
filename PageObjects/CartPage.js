const {expect} = require('@playwright/test');

class CartPage
{

    constructor(page)
    {
        this.page = page;
        this.cartProducts = page.locator("div li").first();
        this.productsText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']")
        this.checkout = page.locator("text=Checkout");
    }

    async verifyProductInCart(productName)
    {
        await this.cartProducts.waitFor();
        const bool = await this.getProductLocator(productName).isVisible();
        expect(bool).toBeTruthy(); 
    }

    async goToCheckout()
    {
        await this.checkout.click();
    }

    getProductLocator(productName)
    {
        return this.page.locator("h3:has-text('" + productName + "')");
    }
    
}

module.exports = {CartPage};