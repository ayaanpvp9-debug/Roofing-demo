import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 45000,
  workers: 1,
  use: {
    baseURL: process.env.TEST_URL || "http://localhost:5173",
    viewport: { width: 1440, height: 900 },
    launchOptions: process.env.CHROME_PATH
      ? {
          executablePath: process.env.CHROME_PATH,
          args: [
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--use-gl=angle",
            "--use-angle=swiftshader",
            "--disable-gpu-sandbox",
          ],
        }
      : {},
  },
});
