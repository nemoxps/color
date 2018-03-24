let numClamp = require('lodash/clamp');

let { toNormalizedHex, toShortHex, toNormalizedHue } = require('./util');


let models = {};
let flowMap = (f, g) => (...args) => g(f(...args), ...args.slice(1));
/**
 * @param {string} str
 * @param {RegExp[]} res
 * @returns {(Array|undefined)}
 */
let findMatch = (str, res) => {
    for (let re of res)
    {
      let match = str.match(re);
      if (match)
        return match;
    }
};
/**
 * @param {string} str
 * @param {RegExp[]} res
 * @param {(function|function[])} [mapFn]
 * @returns {(Array|null)}
 */
let parseColors = (str, res, mapFn) => {
    let match = findMatch(str, res);
    if (!match)
      return null;
    match = match.slice(1);
    if (Array.isArray(mapFn))
      mapFn = flowMap(...mapFn);
    return (mapFn) ? match.map(mapFn) : match;
};
/**
 * @param {Array} transforms
 * @returns {function}
 */
let sanitizeWith = (transforms) => {
    transforms = transforms.map((val) => {
        if (typeof val === 'function')
          return val;
        return (channel) => numClamp(channel, ...val);
    });
    return (c, index) => {
        if (index !== undefined)
          return transforms[index](c);
        return c.map((channel, index) => transforms[index](channel));
    };
};

models.hex = {
    alias: ['#', 'hex'],
    labels: ['rr', 'gg', 'bb'],
    toString: ([rr, gg, bb]) => `#${rr}${gg}${bb}`,
    altToString: {
        shex(c) {
            return toShortHex(this.toString(c));
        },
    },
    re: [
        /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i,
        /^#([\da-f])([\da-f])([\da-f])$/i,
    ],
    parse(str) {
        return parseColors(toNormalizedHex(str), this.re);
    },
    noRound: true,
};

models.rgb = {
    alias: ['rgb', 'rgba'],
    labels: 'rgb',
    toString: ([r, g, b, a]) => (a === undefined) ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`,
    re: [
        /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
        /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d(?:\.\d+)?|\.\d+)\)$/,
        /^rgb\((\d{1,3}%),\s*(\d{1,3}%),\s*(\d{1,3}%)\)$/,
        /^rgba\((\d{1,3}%),\s*(\d{1,3}%),\s*(\d{1,3}%),\s*(\d(?:\.\d+)?|\.\d+)\)$/,
    ],
    parse(str) {
        return parseColors(str, this.re, [(val) => {
            if (val.endsWith('%'))
              return Math.round(255 / 100 * Number(val.slice(0, -1)));
            return Number(val);
        }, this.sanitize]);
    },
    sanitize: sanitizeWith([[0, 255], [0, 255], [0, 255], [0, 1]]),
    supportsAlpha: true,
};

models.hsl = {
    alias: ['hsl', 'hsla'],
    labels: 'hsl',
    toString: ([h, s, l, a]) => (a === undefined) ? `hsl(${h}, ${s}%, ${l}%)` : `hsla(${h}, ${s}%, ${l}%, ${a})`,
    re: [
        /^hsl\(([+-]?\d+),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/,
        /^hsla\(([+-]?\d+),\s*(\d{1,3})%,\s*(\d{1,3})%,\s*(\d(?:\.\d+)?|\.\d+)\)$/,
    ],
    parse(str) {
        return parseColors(str, this.re, [Number, this.sanitize]);
    },
    sanitize: sanitizeWith([toNormalizedHue, [0, 100], [0, 100], [0, 1]]),
    supportsAlpha: true,
};

models.hsv = {
    alias: ['hsv', 'hsva'],
    labels: 'hsv',
    toString: ([h, s, v, a]) => (a === undefined) ? `hsv(${h}, ${s}%, ${v}%)` : `hsva(${h}, ${s}%, ${v}%, ${a})`,
    re: [
        /^hsv\(([+-]?\d+),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/,
        /^hsva\(([+-]?\d+),\s*(\d{1,3})%,\s*(\d{1,3})%,\s*(\d(?:\.\d+)?|\.\d+)\)$/,
    ],
    parse(str) {
        return parseColors(str, this.re, [Number, this.sanitize]);
    },
    sanitize: sanitizeWith([toNormalizedHue, [0, 100], [0, 100], [0, 1]]),
    supportsAlpha: true,
};

models.gray = {
    alias: ['gray'],
    labels: ['gray'],
    toString: ([gray]) => `gray(${gray})`,
    re: [/^gray\((\d{1,3})\)$/],
    parse(str) {
        return parseColors(str, this.re, [Number, this.sanitize]);
    },
    sanitize: sanitizeWith([[0, 100]]),
};

models.lumagray = {
    alias: ['lumagray'],
    labels: ['lumagray'],
    toString: ([lumagray]) => `lumagray(${lumagray})`,
    re: [/^lumagray\((\d{1,3})\)$/],
    parse(str) {
        return parseColors(str, this.re, [Number, this.sanitize]);
    },
    sanitize: sanitizeWith([[0, 100]]),
};

models.keyword = {
    alias: ['keyword'],
    labels: ['keyword'],
    toString: ([keyword]) => keyword,
    re: [/^(\w+)$/],
    parse(str) {
        return parseColors(str, this.re);
    },
    noRound: true,
};

let _test = function (str) {
    return this.re.some((re) => re.test(str));
};
let _round = function (c) {
    return (this.noRound) ? c : [...c.slice(0, this.channels).map(Math.round), ...c.slice(this.channels)];
};
for (let model of Object.values(models))
{
  if (!Object.hasOwnProperty.call(model, 'supportsAlpha'))
    model.supportsAlpha = false;
  if (!Object.hasOwnProperty.call(model, 'noRound'))
    model.noRound = false;
  if (Object.hasOwnProperty.call(model, 'altToString'))
    for (let [altName, altFn] of Object.entries(model.altToString))
      model.altToString[altName] = altFn.bind(model);
  model.channels = model.labels.length;
  model.parse = model.parse.bind(model);
  model.test = _test.bind(model);
  model.round = _round.bind(model);
}


module.exports = models;