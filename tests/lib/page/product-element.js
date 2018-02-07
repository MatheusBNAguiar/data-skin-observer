const PageElement = require('./page-element.js');
const By = require('selenium-webdriver').By;

module.exports = class ProductElement extends PageElement {
    
    constructor(driver, locator, parent){
        super(driver, locator, parent);
    }

    getId(){
        return this.getElement().getAttribute('data-productid');
    }

    getPrice(){
        let priceElm = this.getElement().findElement(By.xpath(".//a[@class='details price']"));
        return priceElm.getText().then( text => {
            if(text === "") return 0;
            return Number(text.substring(1, text.length).replace('.', '').replace(',', '.'));
        });
    }

    getOldPrice(){
        let oldPriceElm = this.getElement().findElement(By.xpath(".//a[@class='details old-price']"));
        return oldPriceElm.getText().then( text => {
            return Number(text.substring(1, text.length).replace(',', '.'));
        }).catch( err => {
            if(err.name === "NoSuchElementError"){
                //if old price is not present, just get the price
                return this.getPrice();
            }
        });
    }

    refresh(){
        let refreshBtn = this.getElement().findElement(By.xpath('.//div[@class="control-skip skip"]'));
        return refreshBtn.click();
    }

    remove(){
        let removeBtn = this.getElement().findElement(By.xpath('.//div[@class="control-remove disable"]'));
        return removeBtn.click();
    }

}