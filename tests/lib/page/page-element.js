module.exports = class PageElement {
    
    constructor(driver, locator, parentLocator) {
        this.driver = driver;
        this.locator = locator;
        this.parentLocator = parentLocator;
    }

    getElement(){
        if(this.parentLocator){
            let parent = this.driver.findElement(this.parentLocator);
            return parent.findElement(this.locator);
        }
        return this.driver.findElement(this.locator);
    }

}