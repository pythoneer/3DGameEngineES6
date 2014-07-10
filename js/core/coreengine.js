import {Game} from './game';
import {Shader} from '../rendering/shader'

export class CoreEngine {

    constructor(width, height, framerate, game, glContext) {

        this.isRunning = false;

        this.width = width;
        this.height = height;
        this.framerate = framerate;
        this.game = game;

        this.canvas = document.getElementById("webgl");

        console.log(glContext);
        this.glContext = glContext;

        this.basicShader = new Shader(glContext, "basic-shader");
    }

    start() {
        console.log("coreengine start");
//        console.log(this.glContext);
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
        window.requestAnimFrame(function() {
            self.run();
            self.render(self);
        }, this.canvas);
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

        self.basicShader.bind();
        self.basicShader.attributeSetFloats("pos", 3, [
            -1, 0, 0,
            0, 1, 0,
            0, -1, 0,
            1, 0, 0
        ]);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }


}