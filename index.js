const fetch = require('fetch-retry');
const apiKeys = require('./api-keys.json');
const fs = require('fs');

const getCurrentAsText = apiKey => {
    const url = `https://static.chaordicsystems.com/static/${apiKey}/current.js`;
    const options = {
        retries: 10,
        method: 'GET',
        headers: {
            'content-type': 'application/text',
        },
    };
    return fetch(url, options)
        .then(response => response.text())
        .then(data => {
            if (data.retry_after) {
                return getCurrentAsText(url, data.retry_after);
            }
            return data;
        });
};

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

const writeJson = (apiKey, dataSkinObject) => {
    const jsonPath = `./objects/${apiKey}.json`;
    return new Promise(((resolve, reject) => {
        const json = JSON.stringify(dataSkinObject);
        fs.writeFile(jsonPath, json, err => {
            if (err) reject(err);
            else resolve(json);
        });
    }));
};

const parseToDataSkins = apiKey => {
    getCurrentAsText(apiKey)
        .then(textData => crawlDataSkins(textData))
        .then(dataSkins => getObjectFromList(dataSkins))
        .then(dataSkinObject => writeJson(apiKey, dataSkinObject))
        .then(() => console.log(`[Parse] ${apiKey} saved`))
        .catch(err => console.log(err));
};

apiKeys.forEach(apiKey => parseToDataSkins(apiKey));
