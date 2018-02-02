const { getData } = require('./Fetcher');
const { writeJson } = require('./Json');
const log = require('node-pretty-log');


const crawlDataSkins = pageData => {
    const dataSkins = pageData.match(/\.addTheme\((([a-zA-Z0-9_."]*(,[a-zA-Z0-9_\-."]*)*)*)./g)
        .map(a => a.replace(/\.addTheme\(|\)|"/g, ''));
    return dataSkins;
};

const getObjectFromList = dataSkins => {
    const dataSkinObject = {};
    dataSkins.forEach(skin => {
        const [widget, dataSkin] = skin.split(',');
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
            .then(dataSkins => getObjectFromList(dataSkins))
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
