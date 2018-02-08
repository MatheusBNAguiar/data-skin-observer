const fs = require('fs');

module.exports = {
    writeJson: (path, object) => new Promise(((resolve, reject) => {
        const json = JSON.stringify(object);
        fs.writeFile(path, json, err => {
            if (err) reject(err);
            else resolve(json);
        });
    })),

    readJson: path => new Promise(((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(err);
            else resolve(JSON.parse(data));
        });
    })),
};
