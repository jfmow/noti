export default class LineBreak {
    static get toolbox() {
        return {
            title: "Break",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><g><path style="stroke: none;" d="M4,20c0,1.1,0.89,2,1.99,2H18c1.1,0,2-0.9,2-2v-3H4L4,20z"/><path style="stroke: none;" d="M19.41,7.41l-4.83-4.83C14.21,2.21,13.7,2,13.17,2H6C4.9,2,4.01,2.89,4.01,3.99l0,7.01H20V8.83 C20,8.3,19.79,7.79,19.41,7.41z M13,8V3.5L18.5,9H14C13.45,9,13,8.55,13,8z"/><path style="stroke: none;" d="M15,14L15,14c0-0.55-0.45-1-1-1h-4c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h4C14.55,15,15,14.55,15,14z"/><path style="stroke: none;" d="M17,14L17,14c0,0.55,0.45,1,1,1h4c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1h-4C17.45,13,17,13.45,17,14z"/><path style="stroke: none;" d="M6,13H2c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h4c0.55,0,1-0.45,1-1v0C7,13.45,6.55,13,6,13z"/></g></g></svg>',
        };
    }

    constructor({ config, }) {
        this.wrapper = undefined;
        this.config = config || {};
    }

    render() {
        this.wrapper = document.createElement("div");
        this._createImage()

        return this.wrapper;
    }

    static get isReadOnlySupported() {
        return true;
    }


    _createImage() {
        this.wrapper.style.width = "100%"
        this.wrapper.style.padding = "0.4em 0"
        this.wrapper.style.minHeight = "40px"
        this.wrapper.style.display = "flex"
        this.wrapper.style.alignItems = "center"
        this.wrapper.style.justifyContent = "center"

        const breakElement = document.createElement('div');
        breakElement.style.width = '100%';
        breakElement.style.height = "2px"
        breakElement.style.background = adjustHexBrightness(document.documentElement.style.getPropertyValue("--background"))
        this.wrapper.appendChild(breakElement)
    }

    save() {
        return
    }
}

function adjustHexBrightness(hex) {
    let hsl = hexToHsl(hex);
    hsl = adjustLightness(hsl);
    return hslToHex(hsl);
}

/**
 * Converts a hex color to HSL.
 * @param {string} hex - The hex color string.
 * @returns {Object} - The HSL representation with properties h, s, and l.
 */
function hexToHsl(hex) {
    // Remove the hash if present
    hex = hex.replace(/^#/, '');

    // Convert hex to RGB
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    // Find the max and min values to get lightness
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

/**
 * Adjusts the lightness of an HSL color.
 * @param {Object} hsl - The HSL color with properties h, s, and l.
 * @returns {Object} - The adjusted HSL color.
 */
function adjustLightness(hsl) {
    if (hsl.l >= 50) {
        hsl.l -= 20;
    } else {
        hsl.l += 20;
    }

    // Ensure lightness remains within 0-100 range
    hsl.l = Math.max(0, Math.min(100, hsl.l));

    return hsl;
}

/**
 * Converts an HSL color back to hex.
 * @param {Object} hsl - The HSL color with properties h, s, and l.
 * @returns {string} - The hex color string.
 */
function hslToHex(hsl) {
    let h = hsl.h / 360;
    let s = hsl.s / 100;
    let l = hsl.l / 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;

        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}