const { When, Then, Given } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { LoginPage } = require('../../PageObjects/LoginPage');
const { DashBoardPage } = require('../../PageObjects/DashBoardPage');
const { CartPage } = require('../../PageObjects/CartPage');
const {CheckoutPage} = require('../../PageObjects/CheckOutPage');
const {OrderHistoryAndDetailPage} = require('../../PageObjects/OrderHistoryAndDetailPage');


Given('login to Ecommerce application with {string} and {string}', { timeout: 100000 }, async function (username, password) {
    const loginPage = new LoginPage(this.page);
    await loginPage.goToLink();
    await loginPage.validLogin(username, password);
});

When('Add product {string} to cart', async function (productName) {
    const dashboardPage = new DashBoardPage(this.page);
    await dashboardPage.searchProductAddToCart(productName);
    await dashboardPage.goToCart();
});

Then('Verify the product {string} is displayed in the cart', async function (ProductName) {
    const cartPage = new CartPage(this.page);
    await cartPage.verifyProductInCart(ProductName);
    await cartPage.goToCheckout();
});

When('Enter valid details and place the order with {string}, {string}, {string}, and {string}', {timeout: 100000},async function (CVV, nameOnCard, couponCode, username) {
    const checkOutPage = new CheckoutPage(this.page);
    await checkOutPage.fillandVerifyCheckoutDetails(CVV, nameOnCard, couponCode, username);
    await checkOutPage.searchCountryAndSelect("ind", "India");
    this.orderId = await checkOutPage.SubmitAndGetOrderId();
    console.log(this.orderId);
});

Then('Verify order is placed and present in OrderHistory', async function () {
    const orderHistoryPage = new OrderHistoryAndDetailPage(this.page);
    await orderHistoryPage.searchOrderAndSelect(this.orderId);
    expect(this.orderId.includes(await orderHistoryPage.getOrderId())).toBeTruthy();
}); 