const apiKeys = require('./api-keys.json');
const { matchInfo } = require('./src/Matcher.js');


apiKeys.forEach(apiKey => matchInfo(apiKey));
