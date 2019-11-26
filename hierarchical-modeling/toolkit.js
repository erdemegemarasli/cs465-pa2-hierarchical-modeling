/**
 * This file handles the required toolkit for the game.
 * It has required functions to generate RGB colors, generate random values, rotate entities and type selectors.
 */

 /**
  * This function converts hex color code to 0.0 - 1.0 scaled RGB array.
  * @param {String} hex Hex color code like '#FF00FF'.
  */
 export function hex2rgb(hex) {
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16) / 255.0;
    const g = parseInt(hex.substring(2, 4), 16) / 255.0;
    const b = parseInt(hex.substring(4, 6), 16) / 255.0;

    return { r, g, b };
}

/**
 * This function flips a coin.
 */
export function randomBinary() {
    return Math.round(Math.random());
}

/**
 * This function generates a random Float number in desired range.
 * @param {Float} min The lower bound of the desired range.
 * @param {Float} max The upper bound of the desired range.
 */
export function generateRandomNumber(min, max) {
    const rand = Math.random() * (max - min) + min;
    return rand;
}

/**
 * This function creates a new 'a' DOM element and it maps the data json to its href attribute as base64encoded data.
 * @param {JSON} exportObj The data object which is going to be downloaded.
 * @param {String} exportName The name of the target file.
 */
export function downloadObjectAsJson(exportObj, exportName) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}