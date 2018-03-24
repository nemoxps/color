let compose = (f, g) => (...args) => f(g(...args));

/**
 * @param {Object} conversions
 * @param {string} fromKey
 * @param {string} toKey
 * @returns {(function|undefined)}
 */
let search = (conversions, fromKey, toKey) => {
    let visited = { [fromKey]: null };
    let nodes = [fromKey];
    
    while (nodes.length)
    {
      let k = nodes.shift();
      let targets = conversions[k];
      
      if (targets[toKey])
      {
        let fn = targets[toKey];
        let path = [k, toKey];
        while (visited[k])
        {
          fn = compose(fn, conversions[visited[k]][k]);
          k = visited[k];
          path.unshift(k);
        }
        fn.path = path;
        return fn;
      }
      
      for (let t of Object.keys(targets))
        if (visited[t] === undefined)
        {
          visited[t] = k;
          nodes.push(t);
        }
    }
};

/**
 * @param {function} fn
 * @param {Object} options
 * @param {string[]} [options.path]
 * @param {boolean} options.supportsAlpha
 * @param {int} options.channels
 * @param {function} options.round
 * @returns {function}
 */
let wrap = (fn, { path = fn.path, supportsAlpha, channels, round }) => {
    let convertToSelf = path.length === 1;
    let wrappedRawFn = (...args) => {
        let c = (Array.isArray(args[0])) ? args[0] : args;
        let rc = fn(c);
        if (!convertToSelf && supportsAlpha && c.length > channels)
          rc.push(c[channels]);
        return rc;
    };
    let wrappedFn = (...args) => {
        return (convertToSelf) ? wrappedRawFn(...args) : round(wrappedRawFn(...args));
    };
    wrappedFn.path = path;
    wrappedFn.raw = wrappedRawFn;
    return wrappedFn;
};


module.exports = { search, wrap };