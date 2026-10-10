const { chromium } = require("playwright");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

async function main() {
  const server = spawn("npx", ["--no-install", "live-server", ".", "--port=5173", "--no-browser", "--quiet"], {
    cwd: __dirname, stdio: ["ignore", "pipe", "pipe"]
  });
  let serverOutput = "";
  server.stdout.on("data", (buf) => (serverOutput += buf.toString()));
  server.stderr.on("data", (buf) => (serverOutput += buf.toString()));

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--enable-webgl", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"]
    });
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    let loaded = false;
    for (let attempt = 0; attempt < 30; attempt++) {
      try {
        const r = await page.goto("http://127.0.0.1:5173", { waitUntil: "domcontentloaded", timeout: 2000 });
        if (r && r.ok()) { loaded = true; break; }
      } catch (_) { await new Promise((resolve) => setTimeout(resolve, 300)); }
    }
    if (!loaded) throw new Error("Could not open the static site: " + serverOutput);
    await page.locator(".hero-visual").waitFor({timeout:10000});
    await page.waitForTimeout(3800);
    const report = await page.evaluate(() => ({
      title: document.title,
      hero: document.querySelector("h1")?.innerText,
      posterLink: document.querySelector('a[href="shl-sara-huang-linkedin.png"]')?.href || null,
      webglReady: document.querySelector("#globe-stage")?.classList.contains("webgl-ready") || false,
      canvasWidth: document.querySelector("#globe-canvas canvas")?.width || 0,
      canvasHeight: document.querySelector("#globe-canvas canvas")?.height || 0,
      fallbackExists: !!document.querySelector(".globe-fallback"),
      canvasCount: document.querySelectorAll("#globe-canvas canvas").length
    }));
    if (!report.hero?.includes("PEOPLE") || !report.posterLink || !report.fallbackExists) {
      throw new Error("Critical landing-page content/fallback is missing: " + JSON.stringify(report));
    }
    fs.mkdirSync(path.join(__dirname, "test-output"), { recursive: true });
    await page.screenshot({ path: path.join(__dirname, "test-output/desktop.png"), fullPage: true });
    await page.setViewportSize({width:390,height:844});
    await page.waitForTimeout(1500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({path:path.join(__dirname,"test-output/mobile.png"),fullPage:true});
    if (overflow > 6) throw new Error("Unexpected horizontal overflow: " + overflow);
    if (errors.length) console.warn("Browser JavaScript errors:", errors);
    console.log("Three.js scene smoke test",JSON.stringify({...report,mobileOverflow:overflow,jsErrors:errors},null,2));
    if (!report.webglReady) console.warn("Software WebGL could not initialize; CSS 3D fallback is available.");
  } finally {
    await browser?.close();
    server.kill("SIGTERM");
  }
}
main().catch((e)=>{console.error(e);process.exitCode=1;});
