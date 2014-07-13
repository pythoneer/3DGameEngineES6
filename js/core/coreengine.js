import {Game} from './game';
import {Shader} from '../rendering/shader'
import {Mesh} from '../rendering/mesh'
import {Vertex} from '../rendering/vertex'
import {Vector3f} from '../core/vector3f'

export class CoreEngine {

    /**
     *
     * @param {number} width
     * @param {number} height
     * @param {number} framerate
     * @param {Game} game
     * @param glContext
     */
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
        this.simpleMesh = new Mesh(glContext);
        var vertecies = [new Vertex( new Vector3f(-1, 0, 0)),
                         new Vertex( new Vector3f(0, 1, 0)),
                         new Vertex( new Vector3f(0, -1, 0)),
                         new Vertex( new Vector3f(1, 0, 0))];
        this.simpleMesh.addVertices(vertecies);
    }

    /**
     *
     */
    start() {
        console.log("coreengine start");
//        console.log(this.glContext);
        if(this.isRunning)
            return;

        this.run();
    }

    /**
     *
     */
    stop(){
        if(!this.isRunning)
            return;

        this.isRunning = false;
    }

    /**
     *
     */
    run() {
        var self = this;
        window.requestAnimFrame(function() {
            self.run();
            self.render(self);
        }, this.canvas);
    }

    /**
     *
     * @param {CoreEngine} self
     */
    render(self) {

        var gl = self.glContext;
        try {
            if (!gl) { throw "x"; }
        } catch (err) {
            throw "Your web browser does not support WebGL!" + err;
        }
        gl.clearColor(0.8, 0.8, 0.8, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        self.basicShader.bind();
        this.simpleMesh.draw();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }


}