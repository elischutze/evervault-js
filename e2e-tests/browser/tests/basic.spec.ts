import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

const encryptedStringRegex =
  /((ev(:|%3A))(debug(:|%3A))?(([A-z0-9+/=%]+)(:|%3A))?((number|boolean|string)(:|%3A))?(([A-z0-9+/=%]+)(:|%3A)){3}(\$|%24))|(((eyJ[A-z0-9+=.]+){2})([\w]{8}(-[\w]{4}){3}-[\w]{12}))/;

test("encrypts a string", async ({ page }) => {
  await page.goto(
    `http://localhost:3010/?team=${process.env.EV_TEAM_UUID}&app=${process.env.EV_APP_UUID}`
  );

  const output = await page.getByTestId("ev-encrypt-output");
  const success = await page.getByTestId("ev-encrypt-success");

  await expect(output).toHaveText(/OUTPUT GOES HERE/);

  await page.getByTestId("ev-encrypt-input").fill("Hello World");
  await page.getByTestId("ev-encrypt-submit").click();

  await expect(output).toHaveText(encryptedStringRegex);
  await expect(success).toHaveText("Success!");
});

test("encrypts an object", async ({ page }) => {
  await page.goto(
    `http://localhost:3010/object_test?team=${process.env.EV_TEAM_UUID}&app=${process.env.EV_APP_UUID}`
  );

  const output = await page.getByTestId("ev-encrypt-output");
  const success = await page.getByTestId("ev-encrypt-success");
  const strings = await page.getByTestId("ev-encrypt-string");
  const t = await page.getByTestId("ev-encrypt-t");

  await expect(output).toHaveText(/OUTPUT GOES HERE/);

  await page.getByLabel(/Your Name/).fill("Shane Curren");
  await page.getByLabel(/Employer Name/).fill("Evervault");
  await page.getByLabel(/Employer Address/).fill("123 Fake Street");
  await page.getByLabel(/Current Employer/).check();
  await page.getByLabel(/Year of Birth/).fill("2000-01-01");

  await page.getByText("Submit").click();

  await expect(output).not.toHaveText(/OUTPUT GOES HERE/);

  const jsonText = await output.innerText();

  const json = JSON.parse(jsonText);

  await expect(json.name).toMatch(encryptedStringRegex);
  await expect(json.yearOfBirth).toMatch(encryptedStringRegex);
  await expect(json.employer.name).toMatch(encryptedStringRegex);
  await expect(json.employer.location).toMatch(encryptedStringRegex);
  await expect(json.employer.current).toMatch(encryptedStringRegex);

  await expect(success).toHaveText("Success!");
  await expect(strings).toHaveText("Success!");
  await expect(t).toHaveText("Success!");
});
