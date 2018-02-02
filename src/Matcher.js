const { getData } = require('./Fetcher');
const { writeJson, readJson } = require('./Json');
const { crawlDataSkin } = require('./Crawler');
const { credentials } = require('../config.json');

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
            const widgetSkin = widgetObject.skin || 'default';
            const isWidgetEnabled = widgetObject.enabled;
            if (specifiedWidget[widgetSkin]) {
                specifiedWidget[widgetSkin]
                    .enabled = specifiedWidget[widgetSkin].enabled || isWidgetEnabled;
            } else {
                specifiedWidget.notListed = specifiedWidget.notListed || {};
                specifiedWidget.notListed[widgetSkin] = [
                    ...(specifiedWidget.notListed[widgetSkin] || []),
                    { location: centralConfig.config.name, enabled: isWidgetEnabled },
                ];
            }
        });
    });
    return dataSkins;
};

const getCrawledData = apiKey => {
    const dataPath = `./objects/${apiKey}.json`;

    return new Promise(resolve => {
        readJson(dataPath)
            .then(data => resolve(data))
            .catch(() => resolve(crawlDataSkin(apiKey)));
    });
};

module.exports = {
    matchInfo: apiKey => {
        const centralUrl = `https://vitrines-staging.chaordic.com.br/api/${apiKey}/templates`;
        const centralInfo = getData(centralUrl, credentials)
            .then(response => response.json())
            .then(data => {
                const basePath = `./base/${apiKey}.json`;
                writeJson(basePath, data);
                return data;
            });

        const dataSkins = getCrawledData(apiKey)
            .then(response => response);

        Promise.all([dataSkins, centralInfo])
            .then(data => crawlThroughInfo(...data))
            .then(matchedData => {
                const processedPath = `./processed/${apiKey}.json`;
                writeJson(processedPath, matchedData);
            })
            .then(() => console.log(`[Matcher] ${apiKey} matched`))
            .catch(err => { console.log(err); });
    },
};
