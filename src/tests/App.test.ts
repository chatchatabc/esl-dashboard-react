import puppeteer, { Browser, Page } from "puppeteer";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let browser: Browser | null = null;
let page: Page | null = null;

describe("App.js", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 25 });
    page = await browser.newPage();
  });

  it("should be launched", async () => {
    expect(browser).not.toBeNull();
    expect(page).not.toBeNull();
  });
});

describe("Login Page", () => {
  it("should be redirected to the login page when not logged in", async () => {
    await page?.goto("http://localhost:3000");
    await page?.waitForSelector("h1");
    const text = await page?.$eval("h1", (e) => e.textContent);
    expect(text).toContain("Sign in");
  });

  it("should be able to login", async () => {
    await page?.goto("http://localhost:3000");
    await page?.waitForSelector("h1");
    await page?.type("#username", "admin");
    await page?.type("#password", "123456");
    await page?.click("button");

    await page?.waitForSelector(".home-page-message");
    const text = await page?.$eval(".home-page-message", (e) => e.textContent);
    expect(text).toContain("Welcome to ESL!");
  });
});

describe("Users Page", () => {
  it("should have an add button", async () => {
    await page?.goto("http://localhost:3000/users");
    await page?.waitForSelector("[data-user-add-button]");
    const button = await page?.$("[data-user-add-button]");
    expect(button).not.toBeNull();
  });

  it("should be able to open the add user modal", async () => {
    await page?.click("[data-user-add-button]");
    await page?.waitForSelector("[data-user-form]");
    const modal = await page?.$("[data-user-form]");
    expect(modal).not.toBeNull();
  });

  it("should be able to close the add user modal", async () => {
    await page?.click(".ant-modal-close");
    await page?.waitForSelector(".ant-modal-mask", { hidden: true });
    const mask = await page?.$(".ant-modal-mask");
    expect(mask).toBeNull();
  });

  it("should be able to open the edit user modal", async () => {
    await page?.waitForSelector("[data-user-edit-button]");
    await page?.click("[data-user-edit-button]");
    await page?.waitForSelector("[data-user-form]");
    const modal = await page?.$("[data-user-form]");
    expect(modal).not.toBeNull();
  });

  it("should be able to close the edit user modal", async () => {
    await page?.click(".ant-modal-close");
    await page?.waitForSelector(".ant-modal-mask", { hidden: true });
    const mask = await page?.$(".ant-modal-mask");
    expect(mask).toBeNull();
  });

  it("should verify phone number", async () => {
    await page?.waitForSelector("[data-user-phone-button=verify]");
    await page?.click("[data-user-phone-button=verify]");
    await page?.waitForSelector(".ant-modal-confirm-btns");
    await page?.click(".ant-modal-confirm-btns button:last-child");
    await page?.waitForSelector(".ant-message-success");
    const message = await page?.$(".ant-message-success");
    expect(message).not.toBeNull();
  });

  it("should revoke phone verification", async () => {
    await page?.waitForSelector("[data-user-phone-button=revoke]");
    await page?.click("[data-user-phone-button=revoke]");
    await page?.waitForSelector(".ant-modal-confirm-btns");
    await page?.click(".ant-modal-confirm-btns button:last-child");
    await page?.waitForSelector(".ant-message-success");
    const message = await page?.$(".ant-message-success");
    expect(message).not.toBeNull();
  });
});

afterAll(() => {
  browser?.close();
  console.log("Browser closed");
});
