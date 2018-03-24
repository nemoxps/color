let Color = require('./Color');


let color = (o) => {
    return Color.from(o);
};

/**
 * Creates a random Color.
 *
 * @returns {Color}
 */
color.random = () => {
    return Color.from('#' + Math.random().toString(16).slice(2, 8));
};


module.exports = color;