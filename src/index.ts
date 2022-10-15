import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    product: "chrome",
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto("https://www.amazon.com/");

  // Type into search box.
  await page.type("#twotabsearchtextbox", "party favors");

  // Wait for suggest overlay to appear and click "show all results".
  const allResultsSelector = "#nav-search-submit-button";
  await page.waitForSelector(allResultsSelector);
  await page.click(allResultsSelector);

  // Wait for the results page to load and display the results.
  const resultsSelector = ".s-search-results .s-result-item";
  await page.waitForSelector(resultsSelector);

  // Extract the results from the page.
  const links = await page.evaluate((results) => {
    return [...document.querySelectorAll<HTMLDivElement>(results)].map(
      (result: HTMLDivElement) => {
        const title = (result.querySelector("h2") as HTMLHeadingElement)
          .textContent;
        let priceDOM: HTMLElement = result.querySelector(
          ".s-price-instructions-style"
        ) as HTMLDivElement;

        priceDOM = priceDOM.querySelector(
          "span .a-offscreen"
        ) as HTMLSpanElement;
        const price = priceDOM.textContent;

        return `${title}-${price}`;
      }
    );
  }, resultsSelector);

  // Print all the files.
  console.log(links.join("\n"));

  //   await browser.close();
})();
