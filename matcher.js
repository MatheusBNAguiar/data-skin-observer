const centralInfo = require('./base-sephora-v6.json');
const dataSkins = require('./objects/sephora-v6.json');
const fs = require('fs');

const getUsedWidgets = slots => {
    let widgets = [];
    Object.values(slots).forEach(slot => {
        widgets = [...widgets, ...slot.widgets];
    });
    return widgets;
};

const crawlThroughInfo = (dataSkins, centralInfo) => {
    centralInfo.forEach(centralConfig => {
        const widgets = getUsedWidgets(centralConfig.slots);
        widgets.forEach(widget => {
            const widgetObject = centralConfig.widgets[widget];
            const specifiedWidget = dataSkins[widgetObject.feature];
            const widgetSkin = widgetObject.skin ? widgetObject.skin : 'default';
            const isWidgetEnabled = widgetObject.enabled;
            console.log(specifiedWidget[widgetSkin]);
            if (specifiedWidget[widgetSkin]) {
                specifiedWidget[widgetSkin]
                    .enabled = specifiedWidget[widgetSkin].enabled || isWidgetEnabled;
            } else {
                specifiedWidget.notListed = [
                    ...(specifiedWidget.notListed || []),
                    { skin: widgetSkin, enabled: isWidgetEnabled },
                ];
            }
        });
    });
    return dataSkins;
};

const writeJson = (apiKey, dataSkinObject) => {
    const jsonPath = `./processed/${apiKey}.json`;
    return new Promise(((resolve, reject) => {
        const json = JSON.stringify(dataSkinObject);
        fs.writeFile(jsonPath, json, err => {
            if (err) reject(err);
            else resolve(json);
        });
    }));
};


const json = crawlThroughInfo(dataSkins, centralInfo);
console.log(json);
writeJson('sephora-v6', json).catch(err => { console.log(err); });
