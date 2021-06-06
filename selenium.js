const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const serviceBuilder = new firefox.ServiceBuilder('../geckodriver.exe');

(async function example() {
  let driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxService(serviceBuilder)
    .build();
  try {
    await driver.get('http://localhost:3000/');
    await driver.findElement(By.linkText('Registrati'));
  } finally {
    await driver.quit();
  }
})();
