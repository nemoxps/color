let _models = require('./_models');
let getColorModel = require('./getColorModel');


let ofString = (str, modelName) => {
    return _models[modelName].parse(str);
};
let ofArray = ([, ...arr], modelName) => {
    return ofString(_models[modelName].toString(arr), modelName);
};

/**
 * Parses a color format.
 *
 * @param {(string|Array)} o A color format.
 * @param {string} [modelName] The color format's model.
 * @returns {Array} The color array.
 * @throws {Error} Color: Unsupported color format.
 */
let parseColor = (o, modelName = getColorModel(o)) => {
    if (modelName === undefined)
      return;
    if (typeof o === 'string')
      return ofString(o, modelName);
    if (Array.isArray(o))
      return ofArray(o, modelName);
    throw new Error('Color: Unsupported color format.');
};


module.exports = parseColor;