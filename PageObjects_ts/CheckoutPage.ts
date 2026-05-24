import { test,expect, Locator, Page } from '@playwright/test';


export class CheckoutPage{
    page: Page;
    userName: Locator;
    cvv: Locator;
    cardName: Locator;
    couponCode: Locator;
    couponApplyButton: Locator;
    couponAppliedText: Locator;
    emailId: Locator;
    country: Locator;
    dropdown: Locator;
    submit: Locator;
    orderConfirmationText: Locator;
    orderId: Locator;

    constructor(page: Page)
    {
        this.page = page;
        this.userName = page.locator("#userEmail");
        this.cvv = page.locator("[class='input txt']").first();
        this.cardName = page.locator("[class='input txt']").last();
        this.couponCode = page.locator("[name='coupon']");
        this.couponApplyButton = page.locator(".btn-primary");
        this.couponAppliedText = page.locator("[style*='color: green']");
        this.emailId = page.locator(".user__name [type='text']").first();
        this.country = page.locator("[placeholder*='Country']");
        this.dropdown = page.locator(".ta-results");
        this.submit =  page.locator(".action__submit");
        this.orderConfirmationText = page.locator(".hero-primary");
        this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
        
    }

    async fillandVerifyCheckoutDetails(CVV: any,nameOnCard: string,couponCode: string,email: string)
    {

        await this.cvv.fill(CVV);
        await this.cardName.fill(nameOnCard);
        await this.couponCode.fill(couponCode);
        await this.couponApplyButton.click();
        await expect(this.couponAppliedText).toHaveText("* Coupon Applied");
        await expect(this.emailId).toHaveText(email)


    }

    async searchCountryAndSelect(countryCode: string, countryName: string)
    {

        await this.country.type(countryCode,{delay:100});
        await this.dropdown.waitFor();
        const optionsCount = await this.dropdown.locator("button").count();
        for(let i =0;i< optionsCount; ++i)
        {
            let text: any;
            text =  await this.dropdown.locator("button").nth(i).textContent();
            if(text.trim() === countryName)
        {
           await this.dropdown.locator("button").nth(i).click();
           break;
        }
        }
    }

    async SubmitAndGetOrderId()
    {
    await this.submit.click();
    await expect(this.orderConfirmationText).toHaveText(" Thankyou for the order. ");
    return await this.orderId.textContent();
    }

}

module.exports = {CheckoutPage};