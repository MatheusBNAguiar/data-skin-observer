const { getData } = require('./Fetcher');
const { writeJson } = require('./Json');
const log = require('node-pretty-log');


const crawlDataSkins = pageData => {
    const dataSkins = pageData.match(/\.addTheme\((([a-zA-Z0-9_."]*(,[a-zA-Z0-9_\-."]*)*)*)./g)
        .map(a => a.replace(/\.addTheme\(|\)|"/g, ''));
    return [dataSkins, pageData];
};


const getVariableResult = (variableName, pageData) => pageData.match(new RegExp(`[\\s]${variableName}\\="([a-zA-Z0-9_\\-]*)"`))[1];

const getObjectFromList = (dataSkins, pageData) => {
    const dataSkinObject = {};
    dataSkins.forEach(skin => {
        const splittedSkin = skin.split(',');
        const [widget] = splittedSkin;
        const dataSkin = splittedSkin[1] &&
        splittedSkin[1].length > 2 ? splittedSkin[1] : getVariableResult(splittedSkin[1], pageData);
        const dataSkinName = dataSkin === 'null' ? 'default' : dataSkin;
        dataSkinObject[widget] = dataSkinObject[widget] || {};
        dataSkinObject[widget][dataSkinName] = { enabled: false };
    });
    return dataSkinObject;
};


module.exports = {
    crawlDataSkin: apiKey => {
        const currentUrl = `https://static.chaordicsystems.com/static/${apiKey}/current.js`;
        getData(currentUrl)
            .then(response => response.text())
            .then(textData => crawlDataSkins(textData))
            .then(data => getObjectFromList(...data))
            .then(dataSkinObject => {
                const dataPath = `./objects/${apiKey}.json`;
                writeJson(dataPath, dataSkinObject);
                return dataSkinObject;
            })
            .then(dataSkinObject => {
                log('success', `[Crawler] ${apiKey} saved`);
                return dataSkinObject;
            })
            .catch(err => log('error', err));
    },
};
