const until = require('selenium-webdriver').until,
      By = require('selenium-webdriver').By;

module.exports = class IframeManager {
    
    constructor(driver){
        this.driver = driver;
    }

    switchTo(widgetName){
        let locator = By.xpath("//div[@data-widget='" + widgetName + "']//iframe");
        let frame = this.driver.wait(until.elementLocated(locator));
        return this.driver.switchTo().frame(frame);
    }
}