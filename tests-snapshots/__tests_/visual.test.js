const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')

expect.extend({ toMatchImageSnapshot })

describe('Visual Regression Testing', () => {
  let browser
  let page

  beforeAll(async function(){
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 10,
    })
    page = await browser.newPage()
  })

  afterEach(async function(){
    await page.waitForTimeout(2000)
  })
  
  afterAll(async function(){
    await browser.close()    
  })

  test('Full Page Snapshot', async function(){
    await page.goto('https://www.example.com')
    await page.waitForSelector('h1')
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: "pixel",
      failureThreshold: 500,
    })
  })

  test('Single Element Snapshot', async function(){
    await page.goto('https://www.example.com')
    const h1 = await page.waitForSelector('h1')
    const image = await h1.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    })
  })
  
  test('Mobile Snapshot', async function(){
    await page.goto('https://www.example.com')
    await page.waitForSelector('h1')
    await page.emulate(puppeteer.devices['iPhone X'])
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    })
  })
  
  test('Tablet Snapshot', async function(){
    await page.goto('https://www.example.com')
    await page.waitForSelector('h1')
    await page.emulate(puppeteer.devices['iPad landscape'])    
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    })
  })

  test('Remove Element Before Snapshot', async function(){
    await page.goto('https://www.example.com')
    await page.evaluate(() => {
      (document.querySelectorAll('h1') || []).forEach(element => element.remove())
    })
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    }) 
  })
})