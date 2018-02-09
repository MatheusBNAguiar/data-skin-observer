const PageElement = require('./page-element.js');
const ProductElement = require('./product-element.js');
const By = require('selenium-webdriver').By;

module.exports =  class FbtWidgetElement extends PageElement {

    constructor(driver){
        super(driver, By.xpath('//div[@id="widget"]'));
        this.fixedProduct = new ProductElement(driver, By.xpath('.//div[@data-index="0"]'), this.locator);
        this.firstProduct = new ProductElement(driver, By.xpath('.//div[@data-index="1"]'), this.locator);
        this.secondProduct = new ProductElement(driver, By.xpath('.//div[@data-index="2"]'), this.locator);
    }

    getFirstProductId(){
        return this.firstProduct.getId();
    }

    removeFirstProduct(){
        return this.firstProduct.remove();
    }

    refreshFirstProduct(){
        return this.firstProduct.refresh();
    }

    getFixedProductPrice(){
        return this.fixedProduct.getPrice();
    }

    getFirstProductPrice(){
        return this.firstProduct.getPrice();
    }

    getSecondProductPrice(){
        return this.secondProduct.getPrice();
    }

    getFixedProductOldPrice(){
        return this.fixedProduct.getOldPrice();
    }

    getFirstProductOldPrice(){
        return this.firstProduct.getOldPrice();
    }

    getSecondProductOldPrice(){
        return this.secondProduct.getOldPrice();
    }

    getSumOfPrices(){
        let promises = [
            this.getFixedProductPrice(),
            this.getFirstProductPrice(),
            this.getSecondProductPrice()
        ];
        
        return Promise.all(promises).then( values =>{
            let sum = values[0] + values[1] + values[2];
            return +sum.toFixed(2);
        });
    }

    getSumOfOldPrices(){
        let promises = [
            this.getFixedProductOldPrice(),
            this.getFirstProductOldPrice(),
            this.getSecondProductOldPrice()
        ];
        
        return Promise.all(promises).then( values =>{
            let sum = values[0] + values[1] + values[2];
            return +sum.toFixed(2);
        });
    }

    getSummaryOldPrice(){
        let oldPriceElm = this.getElement().findElement(By.xpath("//div[@id='summary']//div[@class='old-price']"));
        return oldPriceElm.getText().then( text => {
            return Number(text.substring(2, text.length).replace(',', '.'));
        });
    }
    
    getSummaryPrice(){
        let priceElm = this.getElement().findElement(By.xpath("//div[@id='summary']//div[@class='price']"));
        return priceElm.getText().then( text => {
            return Number(text.substring(1, text.length).replace('.', '').replace(',', '.'));
        });
    }

}