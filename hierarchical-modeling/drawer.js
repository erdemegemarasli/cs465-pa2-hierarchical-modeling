import { hex2rgb, generateRandomNumber } from './toolkit.js';

export function cuboid(e1, e2, e3) {
    const cuboidObj = {};
    cuboidObj.points = [];
    cuboidObj.colors = [];
    e1 = e1 / 2;
    e2 = e2 / 2;
    e3 = e3 / 2;

    const quad = (a, b, c, d) => {
        const vertices = [
            vec4( -e1, -e2,  e3, 1.0 ),
            vec4( -e1,  e2,  e3, 1.0 ),
            vec4(  e1,  e2,  e3, 1.0 ),
            vec4(  e1, -e2,  e3, 1.0 ),
            vec4( -e1, -e2, -e3, 1.0 ),
            vec4( -e1,  e2, -e3, 1.0 ),
            vec4(  e1,  e2, -e3, 1.0 ),
            vec4(  e1, -e2, -e3, 1.0 )      
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
            cuboidObj.colors.push(vColors[a]);
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

export function ellipsoid(a, b, c) {
    const ellipsoidObj = {};
    ellipsoidObj.points = [];
    ellipsoidObj.colors = [];

    a = a / 2;
    b = b / 2;
    c = c / 2;

    const edges  = 200;

    const x = (theta, phi) => {
        return a * Math.sin(theta) * Math.cos(phi);
    };

    const y = (theta, phi) => {
        return b * Math.sin(theta) * Math.sin(phi);
    };

    const z = (theta) => {
        return c * Math.cos(theta);
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
         ellipsoidObj.colors.push(vColors[Math.round(generateRandomNumber(0, 2))]);
    }

    return ellipsoidObj;
}

export function pyramid(e1, e2, h) {
    const pyramidObj = {};
    pyramidObj.colors = [];

    e1 = e1 / 2;
    e2 = e2 / 2;
    h = h / 2;

    pyramidObj.points = [
        // Front face
        vec4(0.0,  h,  0.0, 1.0),
        vec4(-e1, -h,  e2, 1.0),
        vec4(e1, -h,  e2, 1.0),
        // Right face
        vec4(0.0,  h,  0.0, 1.0),
        vec4(e1, -h,  e2, 1.0),
        vec4(e1, -h, -e2, 1.0),
        // Back face
        vec4(0.0,  h,  0.0, 1.0),
        vec4(e1, -h, -e2, 1.0),
        vec4(-e1, -h, -e2, 1.0),
        // Left face
        vec4(0.0,  h,  0.0, 1.0),
        vec4(-e1, -h, -e2, 1.0),
        vec4(-e1, -h,  e2, 1.0),
        // Bottom
        vec4(  e1, -h,  e2, 1.0 ),
        vec4( -e1, -h,  e2, 1.0 ),
        vec4( -e1, -h, -e2, 1.0 ),
        vec4(  e1, -h,  e2, 1.0 ),
        vec4( -e1, -h, -e2, 1.0 ),
        vec4(  e1, -h, -e2, 1.0 )
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