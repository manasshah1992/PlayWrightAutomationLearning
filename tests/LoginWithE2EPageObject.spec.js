const {test, expect} = require('@playwright/test');
const {LoginPage} = require('../PageObjects/LoginPage');
const {DashBoardPage} = require('../PageObjects/DashBoardPage');
const {CartPage} = require('../PageObjects/CartPage');
const {CheckoutPage} = require('../PageObjects/CheckOutPage');
const {OrderHistoryAndDetailPage} = require('../PageObjects/OrderHistoryAndDetailPage');

const dataset = JSON.parse(JSON.stringify(require('../utils/TestData.json')));

for(const data of dataset)
{
test(`User Login with E2E Scenario with POM for ${data.ProductName}`, {tag: ['@Regression']}, async ({page})=>
{

const products = page.locator(".card-body");
const CVV = "476";
const nameOnCard = "Manas Shah";
const couponCode = "rahulshettyacademy";

const loginPage = new LoginPage(page);
await loginPage.goToLink();
await loginPage.validLogin(data.username,data.password);

const dashboardPage = new DashBoardPage(page);
await dashboardPage.searchProductAddToCart(data.ProductName);
await dashboardPage.goToCart();

const cartPage = new CartPage(page);
await cartPage.verifyProductInCart(data.ProductName);
await cartPage.goToCheckout();

const checkOutPage = new CheckoutPage(page);
await checkOutPage.fillandVerifyCheckoutDetails(CVV,nameOnCard,couponCode,data.username);
await checkOutPage.searchCountryAndSelect("ind","India");
const orderId = await checkOutPage.SubmitAndGetOrderId();
console.log(orderId);

const orderHistoryPage = new OrderHistoryAndDetailPage(page);
await orderHistoryPage.searchOrderAndSelect(orderId);
expect(orderId.includes(await orderHistoryPage.getOrderId())).toBeTruthy();

}
);
}