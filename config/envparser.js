// config/envparser.js
const DotEnv = require('dotenv');

let parsedEnv = null;
if (process.env.QUASAR_CONFIG_FILE) {
  console.log('>>>>> Custom ENV PATH: ', process.env.QUASAR_CONFIG_FILE);
  parsedEnv = DotEnv.config({
    path: process.env.QUASAR_CONFIG_FILE
  }).parsed;
} else {
  console.log('>>>>> DEFAULT ENV PATH');
  parsedEnv = DotEnv.config().parsed;
}

module.exports = function (additionalConfig) {
  // Let's stringify our variables
  for (let key in parsedEnv) {
    if (typeof parsedEnv[key] === 'string') {
      parsedEnv[key] = JSON.stringify(parsedEnv[key]);
    }
  }

  for (let key in additionalConfig) {
    parsedEnv[key] = JSON.stringify(additionalConfig[key]);
  }

  return parsedEnv;
};
