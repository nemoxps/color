let objFindKey = require('lodash/findKey');

let _models = require('./_models');


let ofString = (str) => {
    return objFindKey(_models, (model) => model.test(str));
};
let ofArray = ([type, ...arr]) => {
    let modelName = objFindKey(_models, (model) => model.alias.includes(type));
    if (modelName && _models[modelName].test(_models[modelName].toString(arr)))
      return modelName;
};

/**
 * Detects the model of a color format.
 *
 * @param {(string|Array)} o A color format.
 * @returns {string} The color model.
 * @throws {Error} Color: Unsupported color format.
 */
let getColorModel = (o) => {
    if (typeof o === 'string')
      return ofString(o);
    if (Array.isArray(o))
      return ofArray(o);
    throw new Error('Color: Unsupported color format.');
};


module.exports = getColorModel;