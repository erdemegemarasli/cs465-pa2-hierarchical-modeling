/**
 * This file carries the all logic of the program.
 * It is the start activity of the program.
 */

import { hex2rgb, downloadObjectAsJson } from './toolkit.js';
import { cube } from './drawer.js';


// WebGL Properties
let canvas = null;
let gl = null;
let program = null;
let modelViewMatrixLoc = null;
let modelViewMatrix = null;

let limbs = [];
//let rootLimb = null;

// Returns he index of the given limb
function getLimbPosition(limbName, limbNumber){
    for (let i = 0; i < limbs.length; i++){
        if (limbs[i][limbName] == limbName && limbs[i][limbNumber] == limbNumber){
            return i;
        }
    }
    return -1;
}
/**
 * transform = transform matrix
 * render = render function
 * sibling = sibling index
 * child = child index
 * shape = gerek yok galiba
 * limbName = Name of the limb
 * limbNumber = Number of the limb
 */
function createLimb(transform, render, sibling, child, width, height, depth, center, shape, limbName, limbNumber) {
    return {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
        width: width,
        height: height,
        depth: depth,
        center: center,
        shape: shape,
        limbName: limbName,
        limbNumber: limbNumber
    };
}

function processLimbs(limbName, limbNumber, transformation) {

    limbIndex = getLimbPosition(limbName, limbNumber);
    limbs[limbIndex][transform] = mult(transformation, limbs[limbIndex].transform);
}

function traverse(limbName, limbNumber) {

    limbIndex = getLimbPosition(limbName, limbNumber);

    if (limbIndex < 0 ) return;
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure[limbIndex].transform);
    figure[limbIndex].render();
    if (figure[Id].child != null) traverse(figure[limbIndex].child);
    modelViewMatrix = stack.pop();
    if (figure[Id].sibling != null) traverse(figure[limbIndex].sibling);
}

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
let myCube = null;
let myCube2 = null;

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 36);

    let instanceMatrix = mult(rotate(45, 0, 1, 0), modelViewMatrix);
    instanceMatrix = mult(rotate(135, 1, 0, 0), instanceMatrix);
    instanceMatrix = mult(translate(0.5, 0.5, 0.5), instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));

    gl.drawArrays(gl.TRIANGLES, 36, 36);
   
    //requestAnimFrame( render );
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

    myCube = cube(0.1);
    myCube2 = cube(0.2);

    let points = [];
    points = points.concat(myCube.points);
    points = points.concat(myCube2.points);

    let colors = [];
    colors = colors.concat(myCube.colors);
    colors = colors.concat(myCube2.colors);

    console.log(myCube.points);
    console.log(myCube2.points);
    console.log(points);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    modelViewMatrix = mat4();
    //modelViewMatrix = mult(rotate(135, 1, 0, 0), modelViewMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

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