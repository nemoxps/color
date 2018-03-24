let objMapValues = require('lodash/mapValues');

let _models = require('../_models');
let conversions = require('./conversions');
let { search, wrap } = require('./convertUtil');


let convert = objMapValues(conversions, () => ({}));

let cloneColor = (c) => c.slice();
let modelNames = Object.keys(conversions);
for (let fromName of modelNames)
  for (let toName of modelNames)
  {
    let options = {
        supportsAlpha: _models[toName].supportsAlpha,
        channels: _models[fromName].channels,
        round: _models[toName].round,
    };
    if (conversions[fromName][toName])
      convert[fromName][toName] = wrap(
          conversions[fromName][toName],
          Object.assign(options, { path: [fromName, toName] })
      );
    else if (fromName === toName)
      convert[fromName][toName] = wrap(
          cloneColor,
          Object.assign(options, { path: [fromName] })
      );
    else
      convert[fromName][toName] = (...args) => {
          let fn = search(conversions, fromName, toName);
          if (!fn)
            throw new Error(`Color: Cannot convert from "${fromName}" to "${toName}".`);
          convert[fromName][toName] = wrap(fn, options);
          return convert[fromName][toName](...args);
      };
  }


module.exports = convert;