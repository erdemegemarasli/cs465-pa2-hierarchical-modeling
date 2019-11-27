/**
 * This file carries the all logic of the program.
 * It is the start activity of the program.
 */

import { hex2rgb, downloadObjectAsJson } from './toolkit.js';
import { cuboid, ellipsoid, pyramid } from './drawer.js';


// WebGL Properties
let canvas = null;
let gl = null;
let program = null;
let modelViewMatrixLoc = null;


/**
 * This function binds the UI events to the DOM elements.
 * @param {*} gl WebGL instance.
 * @param {*} program Program instance.
 * @param {DOMElement} canvas The canvas object.
 */
function bindEvents(gl, program, canvas) {
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
        
    });

}

const shapes = [];

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (let i = 0; i < shapes.length; i++) {
        let modelViewMatrix = mult(translate(i * 0.3, 0.0, 0.0, 0), mat4());
        modelViewMatrix = mult(rotate(45, 1, 0, 0), modelViewMatrix);
        modelViewMatrix = mult(rotate(45, 0, 1, 0), modelViewMatrix);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLES, shapes[i][0], shapes[i][1]);
    }

    requestAnimFrame( render );
}


window.onload = () => {
    canvas = document.querySelector( 'canvas' );
    gl = WebGLUtils.setupWebGL( canvas );

    if (!gl) return alert( "WebGL isn't available" );
    
    gl.viewport( 0, 0, canvas.width, canvas.height );

    const terrainColor = hex2rgb('#70ad47');
    gl.clearColor( terrainColor.r, terrainColor.g, terrainColor.b, 1.0 );   

    gl.enable(gl.DEPTH_TEST);
     
    program = initShaders( gl, 'vertex-shader', 'fragment-shader' );
    gl.useProgram( program );

    bindEvents(gl, program, canvas);

    let idx = 0;

    const myCube = cuboid(0.2, 0.1, 0.3);
    shapes.push([idx, myCube.points.length]);
    idx += myCube.points.length;

    const myCube2 = cuboid(0.1, 0.2, 0.1);
    shapes.push([idx, myCube2.points.length]);
    idx += myCube2.points.length;

    const myEllipsoid = ellipsoid(0.2, 0.1, 0.3);
    shapes.push([idx, myEllipsoid.points.length]);
    idx += myEllipsoid.points.length;

    const myPyramid = pyramid(0.1, 0.1, 0.1);
    shapes.push([idx, myPyramid.points.length]);
    idx += myPyramid.points.length;

    let points = [];
    points = points.concat(myCube.points);
    points = points.concat(myCube2.points);
    points = points.concat(myEllipsoid.points);
    points = points.concat(myPyramid.points);

    let colors = [];
    colors = colors.concat(myCube.colors);
    colors = colors.concat(myCube2.colors);
    colors = colors.concat(myEllipsoid.colors);
    colors = colors.concat(myPyramid.colors);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mat4()));

    // let modelViewMatrix = mult(rotate(0, 0, 1, 0), mat4());
    // modelViewMatrix = mult(rotate(0, 1, 0, 0), modelViewMatrix);
    // gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    const cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    const vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    const vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    
    const vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};