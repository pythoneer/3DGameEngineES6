import {Game} from './core/game';
import {Shader} from './rendering/shader'
import {Mesh} from './rendering/mesh'
import {Vector3f} from './core/vector3f'
import {Vertex} from './rendering/vertex'

export class TestGame1 extends Game {

    constructor(gl) {
        this.basicShader = new Shader(gl, "basic-shader");
        this.simpleMesh = new Mesh(gl);
        var vertecies = [new Vertex( new Vector3f(-1, 0, 0)),
            new Vertex( new Vector3f(0, 1, 0)),
            new Vertex( new Vector3f(0, -1, 0)),
            new Vertex( new Vector3f(1, 0, 0))];
        this.simpleMesh.addVertices(vertecies);
    }

    init(gl) {
        console.log("init testgame1");


    }

    input(self) {

    }

    update(self) {

    }

    render(self) {
        self.basicShader.bind();
        self.simpleMesh.draw();
    }
}