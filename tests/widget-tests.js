const webdriver = require('selenium-webdriver'),
      until = webdriver.until,
      By = webdriver.By;

const chai = require('chai'),
      expect = require('chai').expect;

const server = require('./mockserver/server.js'),
      ScriptInjector = require('./lib/script-injector.js'),
      IframeManager = require('./lib/iframe-manager.js'),
      PlatformRequestor = require('./lib/platform-requestor.js'),
      ProductELement = require('./lib/page/product-element.js'),
      FbtWidgetElement = require('./lib/page/fbt-widget-element.js');

// loading chromedriver
require('chromedriver');

server.init();

const builder = new webdriver.Builder();
const chromeCapabilities = webdriver.Capabilities.chrome();

let args = ["--start-maximized"];

if(process.argv.indexOf('headless') != -1){
    args = args.concat(["--headless", "--disable-gpu"]);
}

chromeCapabilities.set('chromeOptions', { "args": args});
builder.withCapabilities(chromeCapabilities);

let driver = builder.build();

let scriptInjector = new ScriptInjector(driver),
    iframeManager = new IframeManager(driver),
    platformRequestor = new PlatformRequestor("netshoes-freedom");

const storesArr = [
    {apiKey: 'netshoes-ar', dummy: false}, 
    {apiKey: 'ns-soycuervo', dummy: true}
];

storesArr.forEach( (item, index) => {
    executeSuite(item, () => {
        if(storesArr.length == index + 1){
            driver.quit();
            server.stop();
        }
    });
});

function executeSuite(store, callback){

    describe(store.apiKey.toUpperCase() + ': Offers widget tests', function () {
        this.timeout(10000);
        
        beforeEach(function(done){
            driver.get('http://localhost:1337?homologation=true&dummy=' + store.dummy);

            var chaordic_meta = {
                "page":{
                    "name":"home"
                }
            };

            scriptInjector.insertChaordicMeta(chaordic_meta);
            scriptInjector.insertLoader('//static.chaordicsystems.com/static/loader.js', store.apiKey, "netshoes-freedom");
            
            iframeManager.switchTo('offers').then(()=>{
                done();
            });
        });

        it('Verify if chaordic iframe is loaded', function (done) {
            driver.findElements(By.xpath("//div[@id='widget']")).then( divs => {
                expect(divs.length).to.equal(1);
                done();
            });
        });

    });


    describe(store.apiKey.toUpperCase() + ': Frequently bought together widget tests', function () {

        this.timeout(10000);
        
        let fbtWidgetElement = new FbtWidgetElement(driver);

        beforeEach(function(done){
            driver.get('http://localhost:1337?homologation=true&dummy=true');
            
            var chaordic_meta = {
                page: { 
                    name:"product"
                },
                product:{
                    id:"001-2106-004"
                },
                host:"www.netshoes.com.ar"
            };

            scriptInjector.insertChaordicMeta(chaordic_meta);
            scriptInjector.insertLoader('//static.chaordicsystems.com/static/loader.js', store.apiKey, 'netshoes-freedom');

            iframeManager.switchTo('frequentlyboughttogether').then(()=>{
                done();
            });
        });

        it('Verify sum of prices', function (done) {

            let promises = [
                fbtWidgetElement.getSumOfPrices(),
                fbtWidgetElement.getSummaryPrice()
            ];

            Promise.all(promises).then( values => {
                expect(values[0]).to.equal(values[1]);
                done();
            });

        });

        it('Verify sum of old prices', function (done) {

            let promises = [
                fbtWidgetElement.getSumOfOldPrices(),
                fbtWidgetElement.getSummaryOldPrice()
            ];

            Promise.all(promises).then( values => {
                expect(values[0]).to.equal(values[1]);
                done();
            });
        });

        it('Refresh and check if product is updated', function (done) {

            fbtWidgetElement.getFirstProductId().then( productId => {

                fbtWidgetElement.refreshFirstProduct();
                fbtWidgetElement.getFirstProductId().then( productIdAfterRefresh => {
                    expect(productId).to.not.equal(productIdAfterRefresh);
                    done();
                });
            });
        });

        it('Remove and check if product is removed', function (done) {
            
            let promises = [
                fbtWidgetElement.getFirstProductPrice(),
                fbtWidgetElement.getSummaryPrice()
            ];

            Promise.all(promises).then( values => {
                let firstProductPrice = values[0];
                let sumOfPrices = values[1];

                fbtWidgetElement.removeFirstProduct();
                fbtWidgetElement.getSummaryPrice().then( sumOfPricesAfterRemove => {
                    expect(sumOfPricesAfterRemove).to.equal(sumOfPrices - firstProductPrice);
                    done();
                });
            });
        });

        it('Refresh and check if sum of prices and old prices are ok', function (done) {

            fbtWidgetElement.refreshFirstProduct();

            let promises = [
                fbtWidgetElement.getSumOfPrices(),
                fbtWidgetElement.getSummaryPrice(),
                fbtWidgetElement.getSumOfOldPrices(),
                fbtWidgetElement.getSummaryOldPrice()
            ];

            Promise.all(promises).then( values => {
                expect(values[0]).to.equal(values[1]);
                expect(values[2]).to.equal(values[3]);
                done();
            });
        });

        it('Remove and check if sum of prices are ok', function (done) {
            
            fbtWidgetElement.removeFirstProduct();

            let promises = [
                fbtWidgetElement.getFixedProductPrice(),
                fbtWidgetElement.getSecondProductPrice(),
                fbtWidgetElement.getSummaryPrice(),
                fbtWidgetElement.getFixedProductOldPrice(),
                fbtWidgetElement.getSecondProductOldPrice(),
                fbtWidgetElement.getSummaryOldPrice()
            ];

            Promise.all(promises).then( values => {
                expect(values[0] + values[1]).to.equal(values[2]);
                expect(values[3] + values[4]).to.equal(values[5]);
                done();
            });

        });

        after(function(){
            callback();
        });
    });
}