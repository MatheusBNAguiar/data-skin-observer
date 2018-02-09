module.exports = class ScriptInjector {
    
    constructor(driver){
        this.driver = driver;
    }

    insertLoader(url, apiKey, dataGroup){
        return this.driver.executeScript(function(){

            var script = document.createElement('script');
            script.src = arguments[0];
            script.setAttribute('data-apikey', arguments[1]);

            if(arguments[2]){
                script.setAttribute('data-group', arguments[2]);
            }

            script.setAttribute('async', 'async'); 
            script.setAttribute('defer', 'defer'); 
            document.head.appendChild(script);

        }, url, apiKey, dataGroup);
    }

    insertChaordicMeta(chaordicMeta){
        return this.driver.executeScript(function(){
            window.chaordic_meta = arguments[0];
        }, chaordicMeta);
    }

    insertChaordicDivs(divs){
        divs = divs instanceof Array ? divs : [divs];
        
        return this.driver.executeScript(function(){
            arguments[0].forEach(function(div){
                var divElm = document.createElement('div');
                divElm.setAttribute('chaordic', div);
                document.body.appendChild(divElm);
            });
        }, divs);
    }
}