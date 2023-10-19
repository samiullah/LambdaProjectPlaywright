const { test, expect } = require("@playwright/test");
import { faker } from '@faker-js/faker';

const BASE_URL = "https://www.lambdatest.com";
const welcomeValue = "Welcome to LambdaTest"
const PAGES = {
  seleniumPlayground: "/selenium-playground",
  simpleFormDemo: "/simple-form-demo",
};

const SELECTORS = {
  simpleFormLink: "a:has-text('Simple Form Demo')",
  getCheckedvalueButton: "button:has-text('Get Checked value')",
  messageText: "#message",
  dragDropLink: "a:has-text('Drag & Drop Sliders')",
  inputFormSubmitLink: "a:has-text('Input Form Submit')",
  submitForm: "button:has-text('Submit')"
};

test.describe("Lambda Test Certification Scenarios", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL + PAGES.seleniumPlayground);
    await page.waitForLoadState("domcontentloaded");
  });

  test("test scenario 1", async ({ page }) => {
    await page.locator(SELECTORS.simpleFormLink).click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(new RegExp(PAGES.simpleFormDemo));
    await page.getByPlaceholder('Please enter your Message').fill(welcomeValue);
    await page.locator(SELECTORS.getCheckedvalueButton).click()
    await expect(page.locator(SELECTORS.messageText)).toHaveText(welcomeValue)
  });

  test("test scenario 2", async ({ page }) => {
    await page.locator(SELECTORS.dragDropLink).click();
    await page.waitForLoadState("domcontentloaded");
    const sliderTrack = await page.locator('//*[@id="slider3"]/div/input')
    const sliderOffsetWidth = await sliderTrack.evaluate(el => {
        return el.getBoundingClientRect().width
    })
    let neededOffset = ((95/100)*sliderOffsetWidth)-10
    // we need to move to 95 since range is from 1 to 100, that means 95% of 500 is 475
    // reduced offset by 10 to make it 465
    await sliderTrack.hover({ force: true, position: { x: 0, y: 0 } })
    await page.mouse.down()
    await sliderTrack.hover({ force: true, position: { x: neededOffset, y: 0 } })
    await page.mouse.up() 
    await expect(page.locator('#rangeSuccess')).toHaveText('95',{timeout:2000})

  });



  test("test scenario 3", async ({ page }) => {
    await page.locator(SELECTORS.inputFormSubmitLink).click();
    await page.waitForLoadState("domcontentloaded");
    await page.locator(SELECTORS.submitForm)
    const nameInput = await page.$('#name');
    const validationMessage = await nameInput.evaluate(element => element.validationMessage);
    await expect(validationMessage).toBe('Please fill in this field.')
    await page.getByPlaceholder('Name', { exact: true }).click();
    await page.getByPlaceholder('Name', { exact: true }).fill(faker.person.firstName());
    await page.getByPlaceholder('Email', { exact: true }).click();
    await page.getByPlaceholder('Email', { exact: true }).fill(faker.internet.email());
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill(faker.internet.password());
    await page.getByPlaceholder('Company').click();
    await page.getByPlaceholder('Company').fill(faker.company.name());
    await page.getByPlaceholder('Website').click();
    await page.getByPlaceholder('Website').fill(faker.internet.url());
    await page.getByRole('combobox').selectOption('IN');
    await page.getByPlaceholder('City').click();
    await page.getByPlaceholder('City').fill(faker.location.city());
    await page.getByPlaceholder('Address 1').click();
    await page.getByPlaceholder('Address 1').fill(faker.location.streetAddress());
    await page.getByPlaceholder('Address 2').click();
    await page.getByPlaceholder('Address 2').fill(faker.location.secondaryAddress());
    await page.getByPlaceholder('State').click();
    await page.getByPlaceholder('State').fill(faker.location.state());
    await page.getByPlaceholder('Zip code').click();
    await page.getByPlaceholder('Zip code').fill(faker.location.zipCode());
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('.success-msg')).toHaveText('Thanks for contacting us, we will get back to you shortly.')
  });

  
});
