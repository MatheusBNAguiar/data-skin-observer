const fetch = require('fetch-retry');

module.exports = {
    getData: (url, extraOptions = {}) => {
        const options = Object.assign(extraOptions, {
            retries: 10,
            method: 'GET',
        });
        return fetch(url, options)
            .then(data => {
                if (data.retry_after) {
                    return this.getData(url, data.retry_after);
                }
                return data;
            });
    },
};
