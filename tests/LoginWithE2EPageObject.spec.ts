import {test, expect} from '@playwright/test';
import { LoginPage } from '../PageObjects_ts/LoginPage';
import { DashBoardPage } from '../PageObjects_ts/DashBoardPage';
import {CartPage} from '../PageObjects_ts/CartPage';
import { CheckoutPage } from '../PageObjects_ts/CheckoutPage';
import {OrderHistoryAndDetailPage} from '../PageObjects_ts/OrderHistoryAndDetailPage';

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
let orderId: any;
orderId = await checkOutPage.SubmitAndGetOrderId();
console.log(orderId);

const orderHistoryPage = new OrderHistoryAndDetailPage(page);
await orderHistoryPage.searchOrderAndSelect(orderId);
expect(orderId.includes(await orderHistoryPage.getOrderId())).toBeTruthy();

}
);
}