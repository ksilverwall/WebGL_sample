onload = function() {
    var canvas = document.getElementById('canvas');

    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, document.getElementById('vshader').text);
    gl.compileShader(vshader);
    if(!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vshader));
        return;
    }

    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, document.getElementById('fshader').text);
    gl.compileShader(fshader);
    if(!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fshader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert(gl.getProgramInfoLog(program));
        return;
    }

    gl.useProgram(program);

    var vertex = [
         0.0, 1.0, 0.0,
         1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
    ];

    var index = [
        0, 1, 2,
    ];

    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(index), gl.STATIC_DRAW);


    requestAnimationFrame(update);

    var frame = 0;

    function update() {
        frame++;
        rad = (frame % 360) / 180 * Math.PI;
        var m_rotate = [
            Math.cos(rad), 0.0, Math.sin(rad), 0.0,
            0.0, 1.0, 0.0, 0.0,
            -Math.sin(rad), 0.0, Math.cos(rad), 0.0,
            0.0, 0.0, 0.0, 1.0,
        ];

        loc = gl.getUniformLocation(program, "m_rotate");
        gl.uniformMatrix4fv(loc, false, m_rotate);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
        gl.flush();
        setTimeout(arguments.callee, 1000 / 30);
    }
}
