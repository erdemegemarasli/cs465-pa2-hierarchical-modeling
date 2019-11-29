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
let projectionMatrixLoc = null;
let projectionMatrix = null;
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
let limbsIncrement = [];
const interPolationLimit = 100;
let animationCount = 0;


let keyFrames = [];
//let rootLimb = null;

function scale4(a, b, c) {
    const result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

function trans(limbName, limbNumber, value)  {
    limbs[getLimbPosition(limbName, limbNumber)].pos = add(limbs[getLimbPosition(limbName, limbNumber)].pos, value);
    processLimbs(limbName, limbNumber, translate(value[0], value[1], value[2]));
}

function rot(limbName, limbNumber, value) {
    limbs[getLimbPosition(limbName, limbNumber)].angle = add(limbs[getLimbPosition(limbName, limbNumber)].angle, value);
    const limb = limbs[getLimbPosition(limbName, limbNumber)];
    processLimbs(limbName, limbNumber, rotateAboutCorner(limb.pos, limb.size, value));
}

function saveFrame(){
    keyFrames.push(deepCopy(limbs));
}

function deepCopy(input) {
    const newLimbs = [];

    for (let i = 0; i < input.length; i++) {
        const newLimb = {};
        newLimb.transform = mult(mat4(), input[i].transform);
        newLimb.shape = input[i].shape;
        newLimb.sibling = input[i].sibling;
        newLimb.child = input[i].child;
        newLimb.sibling = input[i].sibling;
        newLimb.limbName = input[i].limbName;
        newLimb.limbNumber = input[i].limbNumber;

        newLimb.pos = vec3(input[i].pos[0], input[i].pos[1], input[i].pos[2]);

        newLimb.size = {};
        newLimb.size.w = input[i].size.w;
        newLimb.size.d = input[i].size.d;
        newLimb.size.h = input[i].size.h;

        newLimb.angle = vec3(input[i].angle[0], input[i].angle[1], input[i].angle[2]);

        newLimbs.push(newLimb);
    }
    

    return newLimbs;
}

function addControlBox(limb, translationAllowed) {
    let box = $("#limb-control-box-template").clone();
    box.attr('id', limb.limbName + limb.limbNumber);
    box.css('display', 'block');
    box.appendTo( "#control-box" );

    box.find('div.header').text(limb.limbName + ' - ' + limb.limbNumber);

    const knobX = box.find('.dial')[0];
    const knobY = box.find('.dial')[1];
    const knobZ = box.find('.dial')[2];

    $(knobX).knob({
        min: 0,
        max: 360,
        angleOffset: 90,
        step: 5,
        rotation: 'anticlockwise',
        change: function() {
            const angle = $(this.$).val();
            const inc = angle - limb.angle[0];
            rot(limb.limbName, limb.limbNumber, vec3(inc, 0, 0));
        }
    });

    $(knobY).knob({
        min: 0,
        max: 360,
        angleOffset: 90,
        step: 5,
        rotation: 'anticlockwise',
        change: function() {
            const angle = $(this.$).val();
            const inc = angle - limb.angle[1];
            rot(limb.limbName, limb.limbNumber, vec3(0, inc, 0));
        }
    });

    $(knobZ).knob({
        min: 0,
        max: 360,
        angleOffset: 90,
        step: 5,
        rotation: 'anticlockwise',
        change: function() {
            const angle = $(this.$).val();
            const inc = angle - limb.angle[2];
            rot(limb.limbName, limb.limbNumber, vec3(0, 0, inc));
        }
    });

    $(knobX).val(limb.angle[0]);
    $(knobY).val(limb.angle[1]);
    $(knobZ).val(limb.angle[2]);
    
    if (translationAllowed) {
        const sliderX = box.find('.slider')[0];
        const sliderY = box.find('.slider')[1];
        const sliderZ = box.find('.slider')[2];

        $(sliderX).slider({
            min: -1,
            max: 1,
            value: 0,
            step: 0.01,
            slide: function(event, ui) {
                const val = ui.value;
                const inc = val - limb.pos[0];
                trans(limb.limbName, limb.limbNumber, vec3(inc, 0, 0));
            }
        });

        $(sliderY).slider({
            min: -1,
            max: 1,
            value: 0,
            step: 0.01,
            slide: function(event, ui) {
                const val = ui.value;
                const inc = val - limb.pos[1];
                trans(limb.limbName, limb.limbNumber, vec3(0, inc, 0));
            }
        });

        $(sliderZ).slider({
            min: -1,
            max: 1,
            value: 0,
            step: 0.01,
            slide: function(event, ui) {
                const val = ui.value;
                const inc = val - limb.pos[2];
                trans(limb.limbName, limb.limbNumber, vec3(0, 0, inc));
            }
        });
    }
}


function playAnimation(){
    if (animationCount <  keyFrames.length){
        console.log("asda");
        limbs = deepCopy(keyFrames[animationCount]);
        if (keyFrames.length - 1 > animationCount){
            interpolate(keyFrames[animationCount + 1]);
        }
        else{
            animationCount = 0;
        }
    }
}

function interpolate(target){
    let initialLimbs = deepCopy(limbs);
    limbsIncrement = [];
    traverseInterpolateIncrement(initialLimbs, target, 0);

    interpolateTimer(0);
}

function interpolateTimer(count) {
    if (count < 100){
        console.log("timer");
        trans(limbs[0].limbName, limbs[0].limbNumber, limbsIncrement[0].pos);
        traverseInterpolate(0, 0);
        count++;
        return setTimeout(interpolateTimer, 10, count);
    }
    else{
        animationCount++;
        playAnimation();
    }
}

function traverseInterpolateIncrement(initial, target, index){
    if (index < 0) return;
    let tempIncrement = {};
    let limbPos = subtract(target[index].pos, initial[index].pos);
    limbPos = mult(limbPos, vec3(1 / interPolationLimit, 1 / interPolationLimit, 1 / interPolationLimit));

    let limbAngle = subtract(target[index].angle, initial[index].angle);
    limbAngle = mult(limbAngle, vec3(1 / interPolationLimit, 1 / interPolationLimit, 1 / interPolationLimit));

    tempIncrement.pos = limbPos;
    tempIncrement.angle = limbAngle;
    limbsIncrement.push(tempIncrement);

    if (initial[index].child != null){
        traverseInterpolateIncrement(initial, target, initial[index].child);
    }

    if (initial[index].sibling != null){
        traverseInterpolateIncrement(initial, target, initial[index].sibling);
    }

}

function traverseInterpolate(index, count){
    if (index < 0) return;
    //console.log(deepCopy(limbs));
    rot(limbs[index].limbName, limbs[index].limbNumber, limbsIncrement[count].angle);
    count++;

    if (limbs[index].child != null){
        traverseInterpolate(limbs[index].child, count);
    }

    if (limbs[index].sibling != null){
        traverseInterpolate(limbs[index].sibling, count);
    }
}

function rotateAboutCorner(pos, size, angle) {
    let m = mat4();

    m = mult(translate(-pos[0], -pos[1] + 0.5 * size.h, -pos[2]), m);
    m = mult(rotate(angle[0], 1, 0, 0), m);
    m = mult(rotate(angle[1], 0, 1, 0), m);
    m = mult(rotate(angle[2], 0, 0, 1), m);
    m = mult(translate(pos[0], pos[1] - 0.5 * size.h, pos[2]), m);

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

    // Neck
    let neck = createLimb(m, "cuboid", 2, 11, "neck", 1, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(neck);
    trans("neck", 1, vec3(-0.4, 0.2, 0.0));
    rot("neck", 1, vec3(0, 0, 60));

    // UpperLeg-FrontLeft
    let uLegFL = createLimb(m, "cuboid", 3, 7, "upperLeg", 1, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(uLegFL);
    trans("upperLeg", 1, vec3(-0.3, 0.04, -0.05));
    rot("upperLeg", 1, vec3(0, 0, 180));
    rot("upperLeg", 1, vec3(0, 0, 45));

    // UpperLeg-FrontRight
    let uLegFR = createLimb(m, "cuboid", 4, 8, "upperLeg", 2, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(uLegFR);
    trans("upperLeg", 2, vec3(-0.3, 0.04, 0.05));
    rot("upperLeg", 2, vec3(0, 0, 180));
    rot("upperLeg", 2, vec3(0, 0, 45));

    // UpperLeg-BackLeft
    let uLegBL = createLimb(m, "cuboid", 5, 9, "upperLeg", 3, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(uLegBL);
    trans("upperLeg", 3, vec3(0.2, 0.04, -0.05));
    rot("upperLeg", 3, vec3(0, 0, 180));
    rot("upperLeg", 3, vec3(0, 0, 45));

    // UpperLeg-BackRight
    let uLegBR = createLimb(m, "cuboid", 6, 10, "upperLeg", 4, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(uLegBR);
    trans("upperLeg", 4, vec3(0.2, 0.04, 0.05));
    rot("upperLeg", 4, vec3(0, 0, 180));
    rot("upperLeg", 4, vec3(0, 0, 45));

    // UpperTail
    let uTail = createLimb(m, "ellipsoid", -1, -1, "upperTail", 1, {w: 0.1, h: 0.4, d: 0.05});
    limbs.push(uTail);
    trans("upperTail", 1, vec3(0.42, 0.2, 0.0));
    rot("upperTail", 1, vec3(0, 0, -120));

    // LowerLeg-FrontLeft
    let lLegFL = createLimb(m, "cuboid", -1, -1, "lowerLeg", 1, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(lLegFL);
    trans("lowerLeg", 1, vec3(-0.02, 0.25, 0));
    rot("lowerLeg", 1, vec3(0, 0, -45));

    // LowerLeg-FrontRight
    let lLegFR = createLimb(m, "cuboid", -1, -1, "lowerLeg", 2, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(lLegFR);
    trans("lowerLeg", 2, vec3(-0.02, 0.25, 0));
    rot("lowerLeg", 2, vec3(0, 0, -45));

    // LowerLeg-BackLeft
    let lLegBL = createLimb(m, "cuboid", -1, -1, "lowerLeg", 3, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(lLegBL);
    trans("lowerLeg", 3, vec3(-0.02, 0.25, 0));
    rot("lowerLeg", 3, vec3(0, 0, -45));


    // LowerLeg-BackRight
    let lLegBR = createLimb(m, "cuboid", -1, -1, "lowerLeg", 4, {w: 0.1, h: 0.3, d: 0.05});
    limbs.push(lLegBR);
    trans("lowerLeg", 4, vec3(-0.02, 0.25, 0));
    rot("lowerLeg", 4, vec3(0, 0, -45));

    // Head
    let head = createLimb(m, "pyramidEx", -1, -1, "head", 1, {w: 0.3, h: 0.45, d: 0.3});
    limbs.push(head);
    trans("head", 1, vec3(-0.02, 0.3, 0));
    rot("head", 1, vec3(0, 0, 90));
}

function drawLimb(limbIndex){

    const m = mult(modelViewMatrix, scale4(limbs[limbIndex].size.w, limbs[limbIndex].size.h, limbs[limbIndex].size.d));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(m));
    if (limbs[limbIndex].shape === "ellipsoid"){
        gl.drawArrays(gl.TRIANGLE_FAN, ellipsoidIndex, ellipsoidLength);
    }
    else if(limbs[limbIndex].shape === "cuboid"){
        gl.drawArrays(gl.TRIANGLES, cuboidIndex, cuboidLength);
    }
    else if(limbs[limbIndex].shape === "pyramid"){
        gl.drawArrays(gl.TRIANGLES, pyramidIndex, pyramidLength);
    }
    else if(limbs[limbIndex].shape === "pyramidEx"){
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
        pos: vec3(0.0, 0.0, 0.0),
        size: size,
        angle: vec3(0.0, 0.0, 0.0)
    };
}

function processLimbs(limbName, limbNumber, transformation) {
    let limbIndex = getLimbPosition(limbName, limbNumber);
    limbs[limbIndex].transform = mult(transformation, limbs[limbIndex].transform);
}

function traverse(limbIndex) {

    if (limbIndex < 0 ) return;

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
function bindEvents() {
    $('#jsonFile').bind('change', () => {
        const file = jsonFile.files[0];
        const fileType = /json.*/;

        if (file.type.match(fileType)) {
            const reader = new FileReader();
            
            reader.onload = () => {
                const content = reader.result;
                const data = JSON.parse(content);
                keyFrames = data;
                for (let i = 0; i < keyFrames.length; i++){
                    for (let j = 0; j < keyFrames[i].length; j++){
                        keyFrames[i][j].transform.matrix = true;
                    }
                }
                

            }
            
            reader.readAsText(file);	
        } else {
            alert ("File not supported!");
        }           
    });

    $(document).keypress(e => {
        if (e.charCode === 119) { // W
            rot("torso", 1, vec3(10, 0, 0));
        }
        else if (e.charCode === 115) { // S
            rot("torso", 1, vec3(-10, 0, 0));
        }
        else if (e.charCode === 97) { // A
            rot("torso", 1, vec3(0, 10, 0));
        }
        else if (e.charCode === 100) { // D
            rot("torso", 1, vec3(0, -10, 0));
        }
        else if (e.charCode === 113) { // Q
            rot("torso", 1, vec3(0, 0, 10));
        }
        else if (e.charCode === 101) { // E
            rot("torso", 1, vec3(0, 0, -10));
        }
    });

    $('#saveButton').click(() => {
        downloadObjectAsJson(keyFrames, "animation");
    });

    $('#loadButton').click(() => {
        $('#jsonFile').click();
    });

    $('#playButton').click(() => {
        playAnimation();
    });

    $('#addButton').click(() => {
        saveFrame();
    });

    $('#viewButton').click(() => {
        const eye = vec3(2.5, 1.5, 1.0);
        const at = vec3(0.0, 0.0, 0.0);
        const up = vec3(0.0, 1.0, 0.0);
        
        modelViewMatrix = mult(mat4(), lookAt(eye, at, up));
    });
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    traverse(getLimbPosition("torso", 1));
    requestAnimFrame(render);
    
}

function moveCamera(r, theta, phi) {
    const x = (r, theta, phi) => {
        return r * Math.sin(theta) * Math.cos(phi);
    };

    const y = (r, theta, phi) => {
        return r * Math.sin(theta) * Math.sin(phi);
    };

    const z = (r, theta) => {
        return r * Math.cos(theta);
    };

    const eye = vec3(x(r, theta, phi), y(r, theta, phi), z(r, theta));
    const at = vec3(0.0, 0.0, 0.0);
    const up = vec3(0.0, 1.0, 0.0);
    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

window.onload = () => {
    canvas = document.getElementById( 'glCanvas' );
    // resize();
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
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    projectionMatrix = ortho(-2.0, 2.0, -2.0, 2.0, -4.0, 4.0);

    // projectionMatrix = mat4();
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

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

    for (let i = 0; i < limbs.length; i++) {
        addControlBox(limbs[i], i === 0);
    }

    render();
};