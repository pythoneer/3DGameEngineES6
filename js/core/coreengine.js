import {Game} from './game';

export class CoreEngine {

    constructor(width, height, framerate, game, glContext) {

        this.isRunning = false;

        this.width = width;
        this.height = height;
        this.framerate = framerate;
        this.game = game;

        this.canvas = document.getElementById("webgl");

        console.log("constructor glContext");
        console.log(glContext);
        this.glContext = glContext;
    }

    start() {
        console.log("coreengine start");
        console.log(this.glContext);
        if(this.isRunning)
            return;

        this.run();
    }

    stop(){
        if(!this.isRunning)
            return;

        this.isRunning = false;
    }

    run() {

        var self = this;
//        console.log(typeof this.run);
//        console.log("canvas");
//        console.log(this.canvas);
//        window.requestAnimFrame(function() {
//            self.run();
//        }, this.canvas);

//        while(true){
//            this.render();
//        }

        setInterval(this.render, 1.0/this.framerate, this);

    }

    shaderProgram(gl, vs, fs) {
        var prog = gl.createProgram();
        var addshader = function(type, source) {
            var s = gl.createShader((type == 'vertex') ?
                gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
            gl.shaderSource(s, source);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                throw "Could not compile "+type+
                    " shader:\n\n"+gl.getShaderInfoLog(s);
            }
            gl.attachShader(prog, s);
        };
        addshader('vertex', vs);
        addshader('fragment', fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            throw "Could not link the shader program!";
        }
        return prog;
    }

    attributeSetFloats(gl, prog, attr_name, rsize, arr) {
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr),
            gl.STATIC_DRAW);
        var attr = gl.getAttribLocation(prog, attr_name);
        gl.enableVertexAttribArray(attr);
        gl.vertexAttribPointer(attr, rsize, gl.FLOAT, false, 0, 0);
    }

    render(self) {

        try {
            var gl = self.glContext;
            if (!gl) { throw "x"; }
        } catch (err) {
            throw "Your web browser does not support WebGL!" + err;
        }
        gl.clearColor(0.8, 0.8, 0.8, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var prog = self.shaderProgram(gl,
                "attribute vec3 pos;"+
                "void main() {"+
                "	gl_Position = vec4(pos, 2.0);"+
                "}",
                "void main() {"+
                "	gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);"+
                "}"
        );
        gl.useProgram(prog);

        self.attributeSetFloats(gl, prog, "pos", 3, [
            -1, 0, 0,
            0, 1, 0,
            0, -1, 0,
            1, 0, 0
        ]);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }


}