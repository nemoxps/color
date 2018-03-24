let objMapValues = require('lodash/mapValues');
let objFindKey = require('lodash/findKey');

let _models = require('../_models');
let { lumaOf } = require('../util');
let cssColors = require('./cssColors');


let convert = objMapValues(_models, () => ({}));

convert.hex.rgb = (c) => {
    return c.map((channel) => Number.parseInt(channel, 16));
};

convert.rgb.hex = ([r, g, b]) => {
    let rrggbb = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    return [rrggbb.slice(0, 2), rrggbb.slice(2, 4), rrggbb.slice(4, 6)];
};

convert.rgb.hsl = ([r, g, b]) => {
    r /= 255; g /= 255; b /= 255;
    
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min)
      h = s = 0;
    else
    {
      let d = max - min;
      s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
      switch (max)
      {
        case r:
          h = ((g < b) ? 6 : 0) + (g - b) / d;
          break;
        case g:
          h = 2 + (b - r) / d;
          break;
        case b:
          h = 4 + (r - g) / d;
          break;
      }
      h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
};

convert.rgb.hsv = ([r, g, b]) => {
    r /= 255; g /= 255; b /= 255;
    
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, v = max;
    if (max === min)
      h = s = 0;
    else
    {
      let d = max - min;
      s = d / max;
      switch (max)
      {
        case r:
          h = ((g < b) ? 6 : 0) + (g - b) / d;
          break;
        case g:
          h = 2 + (b - r) / d;
          break;
        case b:
          h = 4 + (r - g) / d;
          break;
      }
      h /= 6;
    }
    
    return [h * 360, s * 100, v * 100];
};

convert.rgb.gray = ([r, g, b]) => {
    return [(r + g + b) / 3 / 255 * 100];
};

convert.rgb.lumagray = (c) => {
    return [lumaOf(c) * 100];
};

convert.rgb.keyword = (c) => {
    let cstr = c.join('');
    let key = objFindKey(cssColors, (val) => val.join('') === cstr);
    if (key)
      return [key];
    
    let comparativeDistance = ([x0, x1, x2], [y0, y1, y2]) => {
        return (x0 - y0) ** 2 + (x1 - y1) ** 2 + (x2 - y2) ** 2;
    };
    let closestDistance = Infinity;
    let closestKeyword;
    for (let [keyword, rgb] of Object.entries(cssColors))
    {
      let distance = comparativeDistance(c, rgb);
      if (distance < closestDistance)
        [closestDistance, closestKeyword] = [distance, keyword];
    }
    return [closestKeyword];
};

convert.hsl.rgb = ([h, s, l]) => {
    h /= 360; s /= 100; l /= 100;
    
    let r, g, b;
    if (s === 0 || l === 0 || l === 1)
      r = g = b = l;
    else
    {
      let hue2rgb = (p, q, t) => {
          t = (t < 0) ? t + 1 : (t > 1) ? t - 1 : t;
          if (t < 1 / 6)
            return p + 6 * (q - p) * t;
          if (t < 1 / 2)
            return q;
          if (t < 2 / 3)
            return p + 6 * (q - p) * (2 / 3 - t);
          return p;
      };
      let q = (l <= 0.5) ? l * (1 + s) : l + s - l * s,
          p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    
    return [r * 255, g * 255, b * 255];
};

convert.hsl.hsv = ([h, s_, l]) => {
    s_ /= 100; l /= 100;
    
    l *= 2;
    let s = s_ * ((l <= 1) ? l : 2 - l),
        v = (l + s) / 2;
    s = ((2 * s) / (l + s)) || 0;
    
    return [h, s * 100, v * 100];
};

convert.hsv.rgb = ([h, s, v]) => {
    h /= 360; s /= 100; v /= 100;
    
    let r, g, b;
    if (s === 0 || v === 0)
      r = g = b = v;
    else
    {
      let i = Math.floor(6 * h);
      let f = 6 * h - i;
      let vs = [
          v,
          v * (1 - s),
          v * (1 - s * f),
          v * (1 - s * (1 - f)),
      ];
      let perm = [
          [0, 3, 1],
          [2, 0, 1],
          [1, 0, 3],
          [1, 2, 0],
          [3, 1, 0],
          [0, 1, 2],
      ];
      r = vs[perm[i][0]];
      g = vs[perm[i][1]];
      b = vs[perm[i][2]];
    }
    
    return [r * 255, g * 255, b * 255];
};

convert.hsv.hsl = ([h, s_, v]) => {
    s_ /= 100; v /= 100;
    
    let s = s_ * v,
        l = (2 - s_) * v;
    if (l !== 0 && 2 - l !== 0)
      s /= (l <= 1) ? l : 2 - l;
    l /= 2;
    
    return [h, s * 100, l * 100];
};

convert.gray.rgb = convert.lumagray.rgb = ([gray]) => {
    gray = gray / 100 * 255;
    
    return [gray, gray, gray];
};

convert.gray.hsl = convert.gray.hsv = convert.lumagray.hsl = convert.lumagray.hsv = ([gray]) => {
    return [0, 0, gray];
};

convert.keyword.rgb = ([keyword]) => {
    return cssColors[keyword.toLowerCase()];
};


module.exports = convert;