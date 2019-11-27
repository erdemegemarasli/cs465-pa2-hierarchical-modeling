export function cube(edge) {
    const cubeObj = {};
    cubeObj.points = [];
    cubeObj.colors = [];

    const quad = (a, b, c, d) => {
        const vertices = [
            vec4( -edge, -edge,  edge, 1.0 ),
            vec4( -edge,  edge,  edge, 1.0 ),
            vec4(  edge,  edge,  edge, 1.0 ),
            vec4(  edge, -edge,  edge, 1.0 ),
            vec4( -edge, -edge, -edge, 1.0 ),
            vec4( -edge,  edge, -edge, 1.0 ),
            vec4(  edge,  edge, -edge, 1.0 ),
            vec4(  edge, -edge, -edge, 1.0 )      
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
            cubeObj.points.push(vertices[indices[i]]);
            cubeObj.colors.push(vColors[a]);
        }
    }

    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );

    return cubeObj;
}