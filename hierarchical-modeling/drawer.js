import { hex2rgb, generateRandomNumber } from './toolkit.js';


const c1 = hex2rgb("#808080");
const c2 = hex2rgb("#696969");
const c3 = hex2rgb("#DCDCDC");
const c4 = hex2rgb("#D3D3D3");
const c5 = hex2rgb("#C0C0C0");

const brown1 = hex2rgb('#613a00');
const brown2 = hex2rgb('#713a00');
const brown3 = hex2rgb('#813a00');
const brown4 = hex2rgb('#A0522D');
const brown5 = hex2rgb('#8B4513');

// const colors = [
//     [ c1.r, c1.g, c1.b, 1.0 ],
//     [ c2.r, c2.g, c2.b, 1.0 ],
//     [ c3.r, c3.g, c3.b, 1.0 ],
//     [ c4.r, c4.g, c4.b, 1.0 ],
//     [ c5.r, c5.g, c5.b, 1.0 ],
// ];

const colors = [
    [ brown1.r, brown1.g, brown1.b, 1.0 ],
    [ brown2.r, brown2.g, brown2.b, 1.0 ],
    [ brown3.r, brown3.g, brown3.b, 1.0 ],
    [ brown4.r, brown4.g, brown4.b, 1.0 ],
    [ brown5.r, brown5.g, brown5.b, 1.0 ],
];

export function cuboid() {
    const cuboidObj = {};
    cuboidObj.points = [];
    cuboidObj.colors = [];

    const quad = (a, b, c, d) => {
        const vertices = [
            vec4( -0.5, -0.5,  0.5, 1.0 ),
            vec4( -0.5,  0.5,  0.5, 1.0 ),
            vec4(  0.5,  0.5,  0.5, 1.0 ),
            vec4(  0.5, -0.5,  0.5, 1.0 ),
            vec4( -0.5, -0.5, -0.5, 1.0 ),
            vec4( -0.5,  0.5, -0.5, 1.0 ),
            vec4(  0.5,  0.5, -0.5, 1.0 ),
            vec4(  0.5, -0.5, -0.5, 1.0 )      
        ];

        const vColors = [
            [ 0.0, 0.0, 0.0, 1.0 ],  // black
            [ 1.0, 0.0, 0.0, 1.0 ],  // red
            [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
            [ 0.0, 1.0, 0.0, 1.0 ],  // green
            [ 0.0, 0.0, 1.0, 1.0 ],  // blue
            [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
            [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
            [ 1.0, 1.0, 1.0, 1.0 ]   // white
        ];

        const indices = [a, b, c, a, c, d];

        for (let i = 0; i < indices.length; i++) {
            cuboidObj.points.push(vertices[indices[i]]);
            cuboidObj.colors.push(colors[Math.round(generateRandomNumber(0, 4))]);
        }
    }

    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );

    return cuboidObj;
}

export function ellipsoid() {
    const ellipsoidObj = {};
    ellipsoidObj.points = [];
    ellipsoidObj.colors = [];

    const edges  = 200;

    const x = (theta, phi) => {
        return 0.5 * Math.sin(theta) * Math.cos(phi);
    };

    const y = (theta, phi) => {
        return 0.5 * Math.sin(theta) * Math.sin(phi);
    };

    const z = (theta) => {
        return 0.5 * Math.cos(theta);
    };

    for (let theta = 0; theta < 180; theta += (180 / edges)) {
        for (let phi = 0; phi < 360; phi += (360 / edges)) {
            ellipsoidObj.points.push(vec4( x(theta, phi), y(theta, phi),  z(theta), 1.0 ));
        }
    }

    const numOfPoints = ellipsoidObj.points.length;

    const brown1 = hex2rgb('#613a00');
    const brown2 = hex2rgb('#713a00');
    const brown3 = hex2rgb('#813a00');

    const vColors = [
        
        [ brown1.r, brown1.g, brown1.b, 1.0 ],
        [ brown2.r, brown2.g, brown2.b, 1.0 ],
        [ brown3.r, brown3.g, brown3.b, 1.0 ],
    ];

    for (let i = 0; i < numOfPoints; i++) {
         ellipsoidObj.colors.push(colors[Math.round(generateRandomNumber(0, 4))]);
    }

    return ellipsoidObj;
}

export function pyramid() {
    const pyramidObj = {};
    pyramidObj.colors = [];

    pyramidObj.points = [
        // Front face
        vec4(0.0,  0.5,   0.0, 1.0),
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(0.5, -0.5,  0.5, 1.0),
        // Right face
        vec4(0.0,  0.5,  0.0, 1.0),
        vec4(0.5, -0.5,  0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0),
        // Back face
        vec4(0.0,  0.5,  0.0, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        // Left face
        vec4(0.0,  0.5,  0.0, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, -0.5,  0.5, 1.0),
        // Bottom
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5 -0.5, 1.0 )
    ];

    pyramidObj.colors = [
        // Front face
        [ 1.0, 0.0, 0.0, 1.0 ],
        [ 1.0, 0.0, 0.0, 1.0 ],
        [ 1.0, 0.0, 0.0, 1.0 ],
        // Right face
        [ 1.0, 1.0, 0.0, 1.0 ],
        [ 1.0, 1.0, 0.0, 1.0 ],
        [ 1.0, 1.0, 0.0, 1.0 ],
        // Back face
        [ 0.0, 0.0, 1.0, 1.0 ],
        [ 0.0, 0.0, 1.0, 1.0 ],
        [ 0.0, 0.0, 1.0, 1.0 ],
        // Left face
        [ 1.0, 0.0, 1.0, 1.0 ],
        [ 1.0, 0.0, 1.0, 1.0 ],
        [ 1.0, 0.0, 1.0, 1.0 ],
        // Bottom
        [ 0.0, 0.0, 0.0, 1.0 ],
        [ 0.0, 0.0, 0.0, 1.0 ],
        [ 0.0, 0.0, 0.0, 1.0 ],
        [ 0.0, 0.0, 0.0, 1.0 ],
        [ 0.0, 0.0, 0.0, 1.0 ],
        [ 0.0, 0.0, 0.0, 1.0 ]
    ];

    return pyramidObj;
}

export function pyramidEx() {
    const pyramidObj = {};
    pyramidObj.colors = [];

    pyramidObj.points = [
        // Front face
        vec4(-0.5,        -0.5,    0.5,      1.0),
        vec4(-0.5 / 3,    0.5 * 2 / 3,  0.5 / 3,  1.0),
        vec4(0.5 / 3,     0.5 * 2 / 3,  0.5 / 3,  1.0),
        vec4(-0.5,        -0.5,    0.5,      1.0),
        vec4(0.5,         -0.5,    0.5,      1.0),
        vec4(0.5 / 3,     0.5 * 2 / 3,  0.5 / 3,  1.0),

        vec4(0.5,        -0.5,    0.5,      1.0),
        vec4(0.5 / 3,    0.5 * 2 / 3,  0.5 / 3,  1.0),
        vec4(0.5 / 3,     0.5 * 2 / 3,  -0.5 / 3,  1.0),
        vec4(0.5,        -0.5,    0.5,      1.0),
        vec4(0.5,         -0.5,    -0.5,      1.0),
        vec4(0.5 / 3,     0.5 * 2 / 3,  -0.5 / 3,  1.0),


        vec4(0.5,        -0.5,    -0.5,      1.0),
        vec4(0.5 / 3,    0.5 * 2 / 3,  -0.5 / 3,  1.0),
        vec4(-0.5 / 3,     0.5 * 2 / 3,  -0.5 / 3,  1.0),
        vec4(0.5,        -0.5,    -0.5,      1.0),
        vec4(-0.5,         -0.5,    -0.5,      1.0),
        vec4(-0.5 / 3,     0.5 * 2 / 3,  -0.5 / 3,  1.0),



        vec4(-0.5,        -0.5,    -0.5,      1.0),
        vec4(-0.5 / 3,    0.5 * 2 / 3,  -0.5 / 3,  1.0),
        vec4(-0.5 / 3,     0.5 * 2 / 3,  0.5 / 3,  1.0),
        vec4(-0.5,        -0.5,    -0.5,      1.0),
        vec4(-0.5,         -0.5,    0.5,      1.0),
        vec4(-0.5 / 3,     0.5 * 2 / 3,  0.5 / 3,  1.0),


        
        // Bottom
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 ),


        // Top
        vec4(  0.5 / 3, 0.5 * 2 / 3,  0.5 / 3, 1.0 ),
        vec4( -0.5 / 3, 0.5 * 2 / 3,  0.5 / 3, 1.0 ),
        vec4( -0.5 / 3, 0.5 * 2 / 3, -0.5 / 3, 1.0 ),
        vec4(  0.5 / 3, 0.5 * 2 / 3,  0.5 / 3, 1.0 ),
        vec4( -0.5 / 3, 0.5 * 2 / 3, -0.5 / 3, 1.0 ),
        vec4(  0.5 / 3, 0.5 * 2 / 3, -0.5 / 3, 1.0 )
    ];

    // pyramidObj.colors = [
    //     // Front face
    //     [ 1.0, 0.0, 0.0, 1.0 ],
    //     [ 1.0, 0.0, 0.0, 1.0 ],
    //     [ 1.0, 0.0, 0.0, 1.0 ],
    //     [ 1.0, 0.0, 0.0, 1.0 ],
    //     [ 1.0, 0.0, 0.0, 1.0 ],
    //     [ 1.0, 0.0, 0.0, 1.0 ],
    //     // Right face
    //     [ 1.0, 1.0, 0.0, 1.0 ],
    //     [ 1.0, 1.0, 0.0, 1.0 ],
    //     [ 1.0, 1.0, 0.0, 1.0 ],
    //     [ 1.0, 1.0, 0.0, 1.0 ],
    //     [ 1.0, 1.0, 0.0, 1.0 ],
    //     [ 1.0, 1.0, 0.0, 1.0 ],
    //     // Back face
    //     [ 0.0, 0.0, 1.0, 1.0 ],
    //     [ 0.0, 0.0, 1.0, 1.0 ],
    //     [ 0.0, 0.0, 1.0, 1.0 ],
    //     [ 0.0, 0.0, 1.0, 1.0 ],
    //     [ 0.0, 0.0, 1.0, 1.0 ],
    //     [ 0.0, 0.0, 1.0, 1.0 ],
    //     // Left face
    //     [ 1.0, 0.0, 1.0, 1.0 ],
    //     [ 1.0, 0.0, 1.0, 1.0 ],
    //     [ 1.0, 0.0, 1.0, 1.0 ],
    //     [ 1.0, 0.0, 1.0, 1.0 ],
    //     [ 1.0, 0.0, 1.0, 1.0 ],
    //     [ 1.0, 0.0, 1.0, 1.0 ],
    //     // Bottom
    //     [ 0.0, 0.0, 0.0, 1.0 ],
    //     [ 0.0, 0.0, 0.0, 1.0 ],
    //     [ 0.0, 0.0, 0.0, 1.0 ],
    //     [ 0.0, 0.0, 0.0, 1.0 ],
    //     [ 0.0, 0.0, 0.0, 1.0 ],
    //     [ 0.0, 0.0, 0.0, 1.0 ]
    // ];

    for (let i = 0; i < pyramidObj.points.length; i++) {
        pyramidObj.colors.push(colors[Math.round(generateRandomNumber(0, 4))]);
   }

    return pyramidObj;
}