const request = require('request');

module.exports = class PlatformRequestor {
    
    constructor(client){
        this.authentication = 'user:pass';
        this.url = 'https://' + this.authentication + '@platform.chaordicsystems.com/raas/v2/clients/'+ client +'/products/';
    }

    getProduct(id){
        return new Promise((resolve, reject) => {
            request({url: this.url + id}, (error, response, body) => {
                if(error) reject(error);
                
                resolve(JSON.parse(body));
            });
        });
    }

    getProductPrice(id){
        return new Promise((resolve, reject) => {
            this.getProduct(id).then( product => {
                resolve(product.price);
            });
        })
    }

}