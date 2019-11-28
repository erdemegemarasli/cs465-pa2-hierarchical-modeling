/**
 * This file carries the all logic of the program.
 * It is the start activity of the program.
 */

import { hex2rgb, downloadObjectAsJson } from './toolkit.js';
import { ellipsoid, cuboid, pyramid, pyramidEx } from './drawer.js';


// WebGL Properties
let canvas = null;
let gl = null;
let program = null;
let modelViewMatrixLoc = null;
let modelViewMatrix = null;
let ellipsoidIndex = 0;
let ellipsoidLength = 0;
let cuboidIndex = 0;
let cuboidLength = 0;
let pyramidIndex = 0;
let pyramidLength = 0;
let pyramidExIndex = 0;
let pyramidExLength = 0;
let stack = [];

let limbs = [];
//let rootLimb = null;

function scale4(a, b, c) {
    const result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

function trans(limbName, limbNumber, value)  {
    limbs[getLimbPosition(limbName, limbNumber)].pos.x += value.x;
    limbs[getLimbPosition(limbName, limbNumber)].pos.y += value.y;
    limbs[getLimbPosition(limbName, limbNumber)].pos.z += value.z;
    processLimbs(limbName, limbNumber, translate(value.x, value.y, value.z));
}

function rot(limbName, limbNumber, value) {
    limbs[getLimbPosition(limbName, limbNumber)].angle.x += value.x;
    limbs[getLimbPosition(limbName, limbNumber)].angle.y += value.y;
    limbs[getLimbPosition(limbName, limbNumber)].angle.z += value.z;
    const limb = limbs[getLimbPosition(limbName, limbNumber)];
    processLimbs(limbName, limbNumber, rotateAboutCorner(limb.pos, limb.size, {x: value.x, y: value.y, z: value.z}));
}

function rotateAboutCorner(pos, size, angle) {
    let m = mat4();

    m = mult(translate(-pos.x, -pos.y + 0.5 * size.h, -pos.z), m);
    m = mult(rotate(angle.x, 1, 0, 0), m);
    m = mult(rotate(angle.y, 0, 1, 0), m);
    m = mult(rotate(angle.z, 0, 0, 1), m);
    m = mult(translate(pos.x, pos.y - 0.5 * size.h, pos.z), m);

    return m;
}

// Returns he index of the given limb
function getLimbPosition(limbName, limbNumber) {
    for (let i = 0; i < limbs.length; i++) {
        if (limbs[i].limbName === limbName && limbs[i].limbNumber === limbNumber) {
            return i;
        }
    }
    return -1;
}

function initLimbs() {
    let m = mat4();

    // Torso
    let torso = createLimb(m, "ellipsoid", -1, 1, "torso", 1, {w: 1, h: 0.4, d: 0.4});
    limbs.push(torso);
    rot("torso", 1, {x: 0, y: 0, z: 0});
    // trans("torso", 1, {x: 0.4, y: 0.0, z: 0.0});

    // Neck
    let neck = createLimb(m, "cuboid", 2, -1, "neck", 1, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(neck);
    trans("neck", 1, {x: -0.4, y: 0.2, z: 0.0});
    rot("neck", 1, {x: 0, y: 0, z: 60});

    // UpperLeg-FrontLeft
    let uLegFL = createLimb(m, "cuboid", 3, 7, "upperLeg", 1, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(uLegFL);
    trans("upperLeg", 1, {x: -0.3, y: 0.04, z: -0.05});
    rot("upperLeg", 1, {x: 0, y: 0, z: 180});
    rot("upperLeg", 1, {x: 0, y: 0, z: 45});

    // UpperLeg-FrontRight
    let uLegFR = createLimb(m, "cuboid", 4, 8, "upperLeg", 2, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(uLegFR);
    trans("upperLeg", 2, {x: -0.3, y: 0.04, z: 0.05});
    rot("upperLeg", 2, {x: 0, y: 0, z: 180});
    rot("upperLeg", 2, {x: 0, y: 0, z: 45});

    // UpperLeg-BackLeft
    let uLegBL = createLimb(m, "cuboid", 5, 9, "upperLeg", 3, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(uLegBL);
    trans("upperLeg", 3, {x: 0.2, y: 0.04, z: -0.05});
    rot("upperLeg", 3, {x: 0, y: 0, z: 180});
    rot("upperLeg", 3, {x: 0, y: 0, z: 45});

    // UpperLeg-BackRight
    let uLegBR = createLimb(m, "cuboid", 6, 10, "upperLeg", 4, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(uLegBR);
    trans("upperLeg", 4, {x: 0.2, y: 0.04, z: 0.05});
    rot("upperLeg", 4, {x: 0, y: 0, z: 180});
    rot("upperLeg", 4, {x: 0, y: 0, z: 45});

    // UpperTail
    let uTail = createLimb(m, "ellipsoid", -1, -1, "upperTail", 1, {w: 0.1, h: 0.4, d: 0.05});
    limbs.push(uTail);
    trans("upperTail", 1, {x: 0.42, y: 0.2, z: 0.0});
    rot("upperTail", 1, {x: 0, y: 0, z: -120});



    // LowerLeg-FrontLeft
    let lLegFL = createLimb(m, "cuboid", -1, -1, "lowerLeg", 1, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(lLegFL);
    trans("lowerLeg", 1, {x: -0.02, y: 0.25, z: 0});
    rot("lowerLeg", 1, {x: 0, y: 0, z: -45});

    // LowerLeg-FrontRight
    let lLegFR = createLimb(m, "cuboid", -1, -1, "lowerLeg", 2, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(lLegFR);
    trans("lowerLeg", 2, {x: -0.02, y: 0.25, z: 0});
    rot("lowerLeg", 2, {x: 0, y: 0, z: -45});


    // LowerLeg-BackLeft
    let lLegBL = createLimb(m, "cuboid", -1, -1, "lowerLeg", 3, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(lLegBL);
    trans("lowerLeg", 3, {x: -0.02, y: 0.25, z: 0});
    rot("lowerLeg", 3, {x: 0, y: 0, z: -45});


    // LowerLeg-BackRight
    let lLegBR = createLimb(m, "cuboid", -1, -1, "lowerLeg", 4, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(lLegBR);
    trans("lowerLeg", 4, {x: -0.02, y: 0.25, z: 0});
    rot("lowerLeg", 4, {x: 0, y: 0, z: -45});
}

function drawLimb(limbIndex){

    const m = mult(modelViewMatrix, scale4(limbs[limbIndex].size.w, limbs[limbIndex].size.h, limbs[limbIndex].size.d));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(m));
    if (limbs[limbIndex].shape === "ellipsoid") {
        gl.drawArrays(gl.TRIANGLE_FAN, ellipsoidIndex, ellipsoidLength);
    }
    else if(limbs[limbIndex].shape === "cuboid") {
        gl.drawArrays(gl.TRIANGLES, cuboidIndex, cuboidLength);
    }
    else if(limbs[limbIndex].shape === "pyramid") {
        gl.drawArrays(gl.TRIANGLES, pyramidIndex, pyramidLength);
    }
    else if(limbs[limbIndex].shape === "pyramidEx") {
        gl.drawArrays(gl.TRIANGLES, pyramidExIndex, pyramidExLength);
    }
}
/**
 * transform = transform matrix
 * shape = shape function
 * sibling = sibling index
 * child = child index
 * limbName = Name of the limb
 * limbNumber = Number of the limb
 */
function createLimb(transform, shape, sibling, child, limbName, limbNumber, size) {
    return {
        transform: transform,
        shape: shape,
        sibling: sibling,
        child: child,
        limbName: limbName,
        limbNumber: limbNumber,
        pos: {x: 0.0, y: 0.0, z: 0.0},
        size: size,
        angle: {x: 0.0, y: 0.0, z: 0.0}
    };
}

function processLimbs(limbName, limbNumber, transformation) {
    let limbIndex = getLimbPosition(limbName, limbNumber);
    limbs[limbIndex].transform = mult(transformation, limbs[limbIndex].transform);
}

function traverse(limbIndex) {
    

    if (limbIndex < 0 ) return;

    console.log(limbIndex);

    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, limbs[limbIndex].transform);
    
    drawLimb(limbIndex);
    
    if (limbs[limbIndex].child != null) 
        traverse(limbs[limbIndex].child);
    modelViewMatrix = stack.pop();
    
    if (limbs[limbIndex].sibling != null)
        traverse(limbs[limbIndex].sibling);
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

    $(document).keypress(e => {
        if (e.charCode === 119) { // W
            rot("torso", 1, {x: 10, y: 0, z: 0});
        }
        else if (e.charCode === 115) { // S
            rot("torso", 1, {x: -10, y: 0, z: 0});
        }
        else if (e.charCode === 97) { // A
            rot("torso", 1, {x: 0, y: 10, z: 0});
        }
        else if (e.charCode === 100) { // D
            rot("torso", 1, {x: 0, y: -10, z: 0});
        }
        else if (e.charCode === 113) { // Q
            rot("torso", 1, {x: 0, y: 0, z: 10});
        }
        else if (e.charCode === 101) { // E
            rot("torso", 1, {x: 0, y: 0, z: -10});
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

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    traverse(getLimbPosition("torso", 1));
    requestAnimFrame(render);
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

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    let theEllipsoid = ellipsoid();
    let theCuboid = cuboid();
    let thePyramid = pyramid();
    let thePyramidEx = pyramidEx();
    let points = [];
    let colors = [];

    points = points.concat(theEllipsoid.points);
    ellipsoidIndex = 0;
    ellipsoidLength = theEllipsoid.points.length;

    points = points.concat(theCuboid.points);
    cuboidIndex = ellipsoidLength;
    cuboidLength = theCuboid.points.length;

    points = points.concat(thePyramid.points);
    pyramidIndex = ellipsoidLength + cuboidLength;
    pyramidLength = thePyramid.points.length;

    points = points.concat(thePyramidEx.points);
    pyramidExIndex = ellipsoidLength + cuboidLength + pyramidLength;
    pyramidExLength = thePyramidEx.points.length;

    colors = colors.concat(theEllipsoid.colors);
    colors = colors.concat(theCuboid.colors);
    colors = colors.concat(thePyramid.colors);
    colors = colors.concat(thePyramidEx.colors);

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
    

    initLimbs();


  
    render();
};