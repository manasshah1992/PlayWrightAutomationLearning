Feature: Ecommerce validations
@cucumber
Scenario: Placing the order
Given login to Ecommerce application with "manasshah1992@yahoo.com" and "Test@123"
When Add product "ZARA COAT 3" to cart
Then Verify the product "ZARA COAT 3" is displayed in the cart
When Enter valid details and place the order with "476", "Manas Shah", "rahulshettyacademy", and "manasshah1992@yahoo.com"
Then Verify order is placed and present in OrderHistory

