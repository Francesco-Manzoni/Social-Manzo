const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Selenium UI Tests', function () {
  this.timeout(30000);
  let driver;
  let vars;
  beforeEach(async function () {
    driver = await new Builder().forBrowser('firefox').build();
    vars = {};
  });
  afterEach(async function () {
    await driver.quit();
  });
  it('Register', async function () {
    await driver.get('http://localhost:3000/');
    await driver.manage().window().setRect(1550, 838);
    await driver.findElement(By.css('.btn-primary')).click();
    await driver.findElement(By.name('name')).click();
    await driver.findElement(By.name('name')).sendKeys('Selenium');
    await driver.findElement(By.name('email')).sendKeys('selenium@email.com');
    await driver.findElement(By.name('password')).sendKeys('12345678');
    await driver.findElement(By.name('password2')).sendKeys('12345678');
    await driver.findElement(By.css('.btn')).click();
    // Apply timeout
    await driver.manage().setTimeouts({ implicit: 10000 });
    await driver.findElement(By.css('.fa-sign-out-alt')).click();
  });
  it('Login', async function () {
    await driver.get('http://localhost:3000/login');
    await driver.manage().window().setRect(628, 693);
    await driver.findElement(By.name('email')).click();
    await driver.findElement(By.name('email')).sendKeys('selenium@email.com');
    await driver.findElement(By.name('password')).sendKeys('12345678');
    await driver.findElement(By.css('.btn')).click();
    await driver.findElement(By.css('.fa-sign-out-alt')).click();
  });
  it('Crea profilo', async function () {
    await driver.get('http://localhost:3000/login');
    await driver.manage().window().setRect(628, 693);
    await driver.findElement(By.name('email')).click();
    await driver.findElement(By.name('email')).sendKeys('selenium@email.com');
    await driver.findElement(By.name('password')).sendKeys('12345678');
    await driver.findElement(By.name('password')).sendKeys(Key.ENTER);
    // Apply timeout
    await driver.manage().setTimeouts({ implicit: 10000 });
    await driver.findElement(By.linkText('Crea profilo')).click();
    await driver.findElement(By.name('status')).click();
    {
      const dropdown = await driver.findElement(By.name('status'));
      await dropdown.findElement(By.xpath("//option[. = 'Developer']")).click();
    }
    await driver.findElement(By.css('option:nth-child(2)')).click();
    await driver.findElement(By.name('company')).click();
    await driver.findElement(By.name('company')).sendKeys('Selenium');
    await driver.findElement(By.name('location')).click();
    await driver.findElement(By.name('location')).sendKeys('Selenium');
    await driver.findElement(By.name('skills')).click();
    await driver
      .findElement(By.name('skills'))
      .sendKeys('Selenium1, selenium2');
    await driver.findElement(By.name('bio')).click();
    await driver.findElement(By.name('bio')).sendKeys('Prova selenium');
    await driver.findElement(By.css('.btn-primary')).click();
    await driver.findElement(By.css('.fa-sign-out-alt')).click();
  });
  it('Aggiunta esperienza lavorativa', async function () {
    await driver.get('http://localhost:3000/login');
    await driver.manage().window().setRect(628, 693);
    await driver.findElement(By.name('email')).click();
    await driver.findElement(By.name('email')).sendKeys('selenium@email.com');
    await driver.findElement(By.name('password')).sendKeys('12345678');
    await driver.findElement(By.css('.btn')).click();
    // Apply timeout
    await driver.manage().setTimeouts({ implicit: 10000 });
    await driver.findElement(By.linkText('Aggiungi Esperienza')).click();
    await driver.findElement(By.name('title')).click();
    await driver.findElement(By.name('title')).sendKeys('Testing');
    await driver.findElement(By.name('company')).sendKeys('Selenium');
    await driver.findElement(By.name('location')).sendKeys('sel');
    await driver.findElement(By.name('from')).click();
    await driver.findElement(By.name('from')).sendKeys('0001-07-27');
    await driver.findElement(By.name('from')).sendKeys('0019-07-27');
    await driver.findElement(By.name('from')).sendKeys('0199-07-27');
    await driver.findElement(By.name('from')).sendKeys('1996-07-27');
    await driver.findElement(By.name('current')).click();
    await driver.findElement(By.css('.btn-primary')).click();
    await driver.findElement(By.css('li:nth-child(4) > a')).click();
  });
  it('crea post', async function () {
    await driver.get('http://localhost:3000/login');
    await driver.manage().window().setRect(628, 693);
    await driver.findElement(By.css('.container')).click();
    await driver.findElement(By.name('email')).click();
    await driver.findElement(By.name('email')).sendKeys('selenium@email.com');
    await driver.findElement(By.name('password')).sendKeys('12345678');
    await driver.findElement(By.css('.btn')).click();
    // Apply timeout
    await driver.manage().setTimeouts({ implicit: 10000 });
    await driver.findElement(By.css('li:nth-child(1) > a')).click();
    await driver.findElement(By.name('text')).click();
    await driver.findElement(By.name('text')).sendKeys('Ciao');
    await driver.findElement(By.css('.btn-dark')).click();
    await driver.manage().setTimeouts({ implicit: 10000 });

    await driver.findElement(By.css('.fa-sign-out-alt')).click();
  });
  it('Like al post e commento', async function () {
    await driver.get('http://localhost:3000/login');
    await driver.manage().window().setRect(628, 693);
    await driver.findElement(By.name('email')).click();
    await driver.findElement(By.name('email')).sendKeys('selenium@email.com');
    await driver.findElement(By.name('password')).sendKeys('12345678');
    await driver.findElement(By.css('.btn')).click();
    // Apply timeout
    await driver.manage().setTimeouts({ implicit: 10000 });
    await driver.findElement(By.css('li:nth-child(1) > a')).click();
    await driver
      .findElement(By.css('.post:nth-child(1) .fa-thumbs-up'))
      .click();
    await driver.findElement(By.linkText('Commenti')).click();
    // Apply timeout
    await driver.manage().setTimeouts({ implicit: 10000 });
    await driver.findElement(By.name('text')).click();
    await driver.findElement(By.name('text')).sendKeys('ciao');
    await driver.findElement(By.css('.btn-dark')).click();
    await driver.findElement(By.css('.fa-sign-out-alt')).click();
  });
  it('cancella post', async function () {
    await driver.get('http://localhost:3000/login');
    await driver.manage().window().setRect(628, 693);
    await driver.findElement(By.name('email')).click();
    await driver.findElement(By.name('email')).sendKeys('selenium@email.com');
    await driver.findElement(By.name('password')).sendKeys('12345678');
    // Apply timeout
    await driver.manage().setTimeouts({ implicit: 10000 });
    await driver.findElement(By.css('.btn')).click();
    {
      const element = await driver.findElement(By.css('.btn'));
      await driver.actions({ bridge: true }).move(element).perform();
    }
    await driver.findElement(By.css('li:nth-child(1) > a')).click();
    await driver.findElement(By.css('.post:nth-child(1) .btn-danger')).click();
    await driver.findElement(By.css('.fa-sign-out-alt')).click();
  });
  it('Cancellazione utente', async function () {
    await driver.get('http://localhost:3000/login');
    await driver.manage().window().setRect(628, 693);
    await driver.findElement(By.name('email')).click();
    await driver.findElement(By.name('email')).sendKeys('selenium@email.com');
    await driver.findElement(By.name('password')).sendKeys('12345678');
    await driver.findElement(By.css('.btn')).click();
    // Apply timeout
    await driver.manage().setTimeouts({ implicit: 10000 });
    await driver.findElement(By.css('.my-2 > .btn')).click();
    assert(
      (await driver.switchTo().alert().getText()) == 'Cancellare account?'
    );
    await driver.switchTo().alert().accept();
  });
});
