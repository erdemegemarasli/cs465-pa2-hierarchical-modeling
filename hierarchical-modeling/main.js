/**
 * This file carries the all logic of the program.
 * It is the start activity of the program.
 */

import { hex2rgb, downloadObjectAsJson, generateRandomNumber } from './toolkit.js';

/**
 * This function binds the UI events to the DOM elements.
 * @param {*} gl WebGL instance.
 * @param {*} program Program instance.
 * @param {DOMElement} canvas The canvas object.
 * @param {Float} aspect The aspect of the canvas edges.
 */
function bindEvents(gl, program, canvas, aspect) {
    $('#jsonFile').bind('change', () => {
        const file = jsonFile.files[0];
        const fileType = /json.*/;

        if (file.type.match(fileType)) {
            const reader = new FileReader();
            
            reader.onload = () => {
                const content = reader.result;
                const data = JSON.parse(content);
                

            }
            
            reader.readAsText(file);	
        } else {
            alert ("File not supported!");
        }           
    });

    $('#saveButton').click(() => {
        downloadObjectAsJson({}, "data");
    });

    $('#loadButton').click(() => {
        $('#jsonFile').click();
    });

    $('canvas').click(event => {
        if (currentAttractor !== null) {
            const x = -1 + 2 * event.clientX / canvas.width;
            const y = -1 + 2 * (canvas.height - event.clientY) / canvas.height;
    
            attractorData.push({type: currentAttractor, pos: {x, y}});
    
            generateEntityData(entityCount.value, aspect);
            render(gl, program, aspect);
        }
    });

}

/**
 * This function renders all the scene using the entity data.
 * @param {*} gl WebGL instance.
 * @param {*} program Program instance.
 * @param {Float} aspect The aspect of the canvas edges.
 */
function render(gl, program, aspect) {
    gl.clear( gl.COLOR_BUFFER_BIT );
}

window.onload = () => {
    const canvas = document.querySelector( 'canvas' );
    
    const aspect = canvas.width / canvas.height;
    const gl = WebGLUtils.setupWebGL( canvas );

    if (!gl) return alert( "WebGL isn't available" );
    
    gl.viewport( 0, 0, canvas.width, canvas.height );

    const terrainColor = hex2rgb('#70ad47');
    gl.clearColor( terrainColor.r, terrainColor.g, terrainColor.b, 1.0 );   
     
    const program = initShaders( gl, 'vertex-shader', 'fragment-shader' );
    gl.useProgram( program );

    bindEvents(gl, program, canvas, aspect);

    // Empty Canvas
    gl.clear( gl.COLOR_BUFFER_BIT );

    render(gl, program, aspect);
};