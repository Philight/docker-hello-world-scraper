const puppeteer = require('puppeteer');
//import puppeteer from 'puppeteer';
const path = require("path");
const fs = require('fs')
const got = require('got');

require('dotenv').config()
const APPNAME = process.env.APPNAME;
const HOSTNAME = process.env.HOSTNAME;
const PORT = process.env.PORT;

const CONSTANTS = require(path.join(process.cwd(), 'src', 'CONSTANTS.js'));
const { 
  getCurrentDate, randomInterval,
} = require(path.join(process.cwd(), 'src', 'util.js'));



const getCurrentURL = async (page) => {
  const title = await page.title();
  const url = await page.url(); 
  const html = await page.content(); 
console.log(`### ${APPNAME} | Current page title: `+title);
console.log(`### ${APPNAME} | Current page url: `+url);
//  fs.writeFileSync(`current-page.html`, html.toString(), { encoding:'utf8', flag: 'w' });
//  fs.writeFile('html/current-page.html', html.toString(), { encoding:'utf8', flag: 'w' }); 
//  console.log('## finished writing current-page.html');
}


/********** 
    PUPPETEER CONFIG
*********/

const getDefaultBrowser = async (headless) => {
  const browser = await puppeteer.launch({
    headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const context = browser.defaultBrowserContext();
  context.overridePermissions(CONSTANTS.TARGET_URL, []);

  return browser;
};

const getDefaultPage = async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({
    width: 1024,
    height: 768,
    deviceScaleFactor: 1,
  });
  //await page.setDefaultNavigationTimeout(Number.MAX_SAFE_INTEGER);

  return page;
};


/********** 
    SCRAPE
*********/

const scrapeData = async (page) => {
console.log(`--- ${APPNAME} | scrapeData`);

  let scrapedPosts = [];

  // Check Cookie Banner
  const cookieBannerSelector = 'div[data-testid="dialog-overlay"]';
  const cookieBanner = await page.$(cookieBannerSelector); 
  if ( cookieBanner !== null ) {//&& await cookieBanner.evaluate(elem => elem.textContent.includes('cookies')) ) {
console.log('### cookie banner found. Removing..');
  
  } else {
console.log('### No Cookie banner found');      
  } 

  // Srape DOM
  try {

    // Find Property List

    const FEED_SELECTOR = 'div.dir-property-list';
    await page.waitForSelector(`${FEED_SELECTOR}`);

//    const propertyListHTML = await page.$eval(FEED_SELECTOR, elem => elem.innerHTML);
    const $propertyList = await page.$(FEED_SELECTOR);
    
    const $properties = await $propertyList.$$('div.property');
//    console.log('## properties');
//    console.log($properties);
console.log(`+++ ${APPNAME} | scrapeData | Properties found: ${$properties.length}`);

    // For Each Property (Post)

    for(let [propertyIndex, $property] of ($properties.entries())) { 
//      console.log('## $property');
//      console.log($property);

      // Images
      const IMAGES_CONTAINER_SELECTOR = 'preact[component="property-carousel"]';
      let $images = await $property.$$(`${IMAGES_CONTAINER_SELECTOR} img`);

      let postImages = [];
      for(let [imageIndex, $image] of ($images.entries())) { 
        let postImage = await $image.evaluate(elem => elem.getAttribute("src"));
//        console.log('## $property image');
//        console.log(postImage);
        postImages.push(postImage);
      }

      // Title and Link
      const TITLE_LINK_SELECTOR = 'div.info h2 a';
      let $titlelink = await $property.$(TITLE_LINK_SELECTOR);

      let postTitle = await $titlelink.evaluate(elem => elem.textContent);
//      console.log('## $property title');
//      console.log(postTitle);
      let postUrl = await $titlelink.evaluate(elem => elem.getAttribute("href"));
      postUrl = CONSTANTS.TARGET_URL+postUrl;
//      console.log('## $property link');
//      console.log(postUrl);

      scrapedPosts.push({ title: postTitle, url: postUrl, images: postImages })
    }

    return scrapedPosts;

console.log(`+++ ${APPNAME} | scrapeData | FINISHED`);
  } catch(err) {
    console.log(`!!! ${APPNAME} | scrapeData | error..`);
    console.error(err);
  }

}

/********** 
    BROWSER
*********/

const runHeadlessBrowser = async () => {
console.log(`--- ${APPNAME} | runHeadlessBrowser | OPENING BROWSER..`);

   let startTime = getCurrentDate();
   
   const browser = await getDefaultBrowser(true);
   const page = await getDefaultPage(browser);

   var pagination = 1;
   let allPostsData = [];

   while (allPostsData.length < CONSTANTS.NUM_OF_POSTS) {
    var URL = CONSTANTS.TARGET_URL+CONSTANTS.TARGET_PATH;
    if (pagination > 1) { URL += CONSTANTS.PAGINATION_PATH.replace('$digit', pagination) }

    try {
console.log(`--- ${APPNAME} | runHeadlessBrowser | Navigating to ${URL}`);
      await page.goto(URL);
      await page.waitForTimeout(2000);
      await getCurrentURL(page);
    
    } catch(err) {
      console.error(err)
console.log(`!!! ${APPNAME} | runHeadlessBrowser | Failed to navigate to page, retrying.. Navigating to ${URL}`);
      await page.goto(URL);
      await page.waitForTimeout(2000);
      await getCurrentURL(page);
    }
    const scrapedData = await scrapeData(page);
    allPostsData.push(...scrapedData);
    pagination++;
console.log(`+++ ${APPNAME} | runHeadlessBrowser | new scrapedData`);
console.log(scrapedData.length);
console.log(`+++ ${APPNAME} | runHeadlessBrowser | allPostsData`);
console.log(allPostsData.length);
   }
   
   
   const options = {
      method: 'POST',
//      url: 'http://localhost:8080/database/posts',
      json: allPostsData,
   }

   // Call Database API - store posts
   const dbRes = await got.post(`http://${HOSTNAME}:${PORT}/database/posts`, options)

console.log(`### ${APPNAME} | runHeadlessBrowser | CLOSING BROWSER..`); await page.waitForTimeout(randomInterval(5000,11000));
   await browser.close();   


   // Restart Server
   return(true);
   process.exit();
}


module.exports = {
  runHeadlessBrowser: runHeadlessBrowser,
}