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
  it("should have a add button", async () => {
    await page?.goto("http://localhost:3000/users");
    await page?.waitForSelector("[data-user-add-button]");
    const button = await page?.$("[data-user-add-button]");
    expect(button).not.toBeNull();
  });

  it("should be able to open the add user modal", async () => {
    await page?.goto("http://localhost:3000/users");
    await page?.waitForSelector("[data-user-add-button]");
    await page?.click("[data-user-add-button]");
    await page?.waitForSelector("[data-user-form]");
    const modal = await page?.$("[data-user-form]");
    expect(modal).not.toBeNull();
  });
});

afterAll(() => browser?.close());
