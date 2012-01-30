/**
 * JavaScript color conversion. Translates color strings (hex codes or RGB strings) to RGB, Hex, HSV, HSL, and more.
 * @name        Color
 * @class
 * @version     1.0
 * @author      <a href="mailto:real.deprez@gmail.com">Real Deprez</a>
 */
Color = window.Color || {
    /**
     * Version number.
     * @name        VERSION
     * @memberOf    Color
     */
    VERSION: '1.0',
    /**
    * Parse string for color value (hex code or RGB).
    * @name         _parse
    * @methodOf     Color
    * @param        {String} string Color string
    * @returns      {Array} RGB array
    */
    _parse: function (string) {
        if (/,/.test(string)) { // RGB string
            var match = string.match(/(\d{1,3})/g);
            for (var i = 0, len = match.length; i < len; i++) {
                match[i] = Number(match[i]);
            }
            return match;
        } else { // hex code
            return this._hexToRGB(string.replace('#', ''));
        }
    },
    /**
    * Integer to hexadecimal.
    * @name         _intToHex
    * @methodOf     Color
    * @param        {Integer} num Integer
    * @returns      {String} Hexadecimal
    */
    _intToHex: function (num) {
        var hex = parseInt(num, 10).toString(16);
        return '00'.substr(0, 2 - hex.length) + hex;
    },
    /**
    * Hexadecimal to integer.
    * @name         _hexToInt
    * @methodOf     Color
    * @param        {String} hex Hexadecimal
    * @returns      {Integer} Integer
    */
    _hexToInt: function (hex) {
        return parseInt('0x' + hex, 16);
    },
    /**
    * Hex code to RGB.
    * @name         _hexToRGB
    * @methodOf     Color
    * @param        {String} hex Hex code
    * @returns      {Array} RGB [0-255, 0-255, 0-255]
    */
    _hexToRGB: function (hex) {
        var hex_array = [],
            rgb_array = [];
        for (var i = 0; i < 3; i++) {
            hex_array.push(hex.slice(i * 2, i * 2 + 2));
        }
        for (var j = 0; j < 3; j++) {
            rgb_array.push(this._hexToInt(hex_array[j]));
        }
        return rgb_array;
    },
    /**
    * RGB to hex code.
    * @name         _RGBToHex
    * @methodOf     Color
    * @param        {Array} RGB RGB array [R, G, B]
    * @returns      {String} Hex code #XXXXXX
    */
    _RGBToHex: function (RGB) {
        var hex_array = [];
        for (var i = 0; i < 3; i++) {
            hex_array.push(this._intToHex(RGB[i]));
        }
        return '#' + hex_array.join('');
    },
    /**
    * RGB Transform.
    * @name         _RGBTransform
    * @methodOf     Color
    * @param        {Array} RGB An array of RGB values [R, G, B]
    * @returns      {Object} 
    */
    _RGBTransform: function (RGB) {
        var R = RGB[0] / 255,
            G = RGB[1] / 255,
            B = RGB[2] / 255;
        var max = Math.max(R, G, B),
            min = Math.min(R, G, B),
            C = max - min;
        var H_;
        if (C == 0) {
            H_ = 0;
        } else if (max == R) {
            H_ = ((G - B) / C) % 6;
        } else if (max == G) {
            H_ = ((B - R) / C) + 2;
        } else if (max == B) {
            H_ = ((R - G) / C) + 4;
        }
        var H = 60 * H_;
        if (H < 0) {
            H += 360;
        }
        var V = max;
        var L = 0.5 * (max + min);
        var I = (1 / 3) * (R + G + B);
        var Y_ = (0.21 * R) + (0.72 * G) + (0.07 * B);
        var S_HSV = (C == 0) ? 0 : C / V;
        var S_HSL = (C == 0) ? 0 : C / (1 - Math.abs((2 * L) - 1));
        var S_HSI = (C == 0) ? 0 : 1 - (min / I);
        return {
            hex: this._RGBToHex(RGB),
            R: RGB[0],
            G: RGB[1],
            B: RGB[2],
            H: Math.round(H),
            V: Math.round(V * 100),
            L: Math.round(L * 100),
            I: Math.round(I * 100),
            Y_: Math.round(Y_ * 100),
            S_HSV: Math.round(S_HSV * 100),
            S_HSL: Math.round(S_HSL * 100),
            S_HSI: Math.round(S_HSI * 100)
        };
    },
    /**
     * Returns a random color in hexadecimal notation.
     * @name        random
     * @methodOf    Color
     * @returns     {String} Hex code
     */
    random: function () {
        var hex = (Math.floor(Math.random() * (0xFFFFFF + 1))).toString(16);
        return '000000'.substr(0, 6 - hex.length) + hex;
    },
    /**
    * Color string to RGB.
    * @name         RGB
    * @methodOf     Color
    * @param        {String} string Color string (hex code or RGB string)
    * @returns      {String} Comma separated RGB string
    */
    RGB: function (string) {
        return this._parse(string).join(',');
    },
    /**
    * Color string to hex.
    * @name         hex
    * @methodOf     Color
    * @param        {String} string Color string (hex code or RGB string)
    * @returns      {String} Hex code
    */
    hex: function (string) {
        return this._parse(string)._RGBToHex;
    },
    /**
    * Color string to HSV.
    * @name         HSV
    * @methodOf     Color
    * @param        {String} string Color string (hex code or RGB string)
    * @returns      {String} Comma separated HSV string
    */
    HSV: function (string) {
        var obj = this._RGBTransform(this._parse(string));
        return obj.H + ',' + obj.S_HSV + ',' + obj.V;
    },
    /**
    * Color string to HSL.
    * @name         HSL
    * @methodOf     Color
    * @param        {String} string Color string (hex code or RGB string)
    * @returns      {String} Comma separated HSL string
    */
    HSL: function (string) {
        var obj = this._RGBTransform(this._parse(string));
        return obj.H + ',' + obj.S_HSL + ',' + obj.V;
    },
    /**
    * Color string to all calculated color values.
    * @name         all
    * @methodOf     Color
    * @param        {String} string Color string (hex code or RGB string)
    * @returns      {Object} Object containing all color values.
    */
    all: function (string) {
        return this._RGBTransform(this._parse(string));
    }
};