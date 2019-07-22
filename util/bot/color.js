exports.isColor = (color) => {

    /** parse-color package */
    const parseColor = require('parse-color');
    /** result variable */
    let result = 'noColor';
    /** if no color given -> return */
    if (!color) return result;

    /** if we have a 3 or 6 digit hex code */
    if (!color.startsWith('#') && (color.length === 6)) {

        const test = parseColor(`#${color}`); //test

        /** if we get no result (parsing color) */
        if (!test.cmyk || !test.rgb || !test.hsv || !test.hsl || !test.hex) {
            return result;
        }

        return test; //seems like a valid color!

    } else {
        color = parseColor(color); //seems like a valid color (hex, css)
    }

    /** check -> if we found a valid color */
    if (!color.cmyk || !color.rgb || !color.hsv || !color.hsl || !color.hex) {
        return result; //no valid color!
    }

    /** valid color -> we return the hex string */
    result = color.hex.toString();
    return result;

};