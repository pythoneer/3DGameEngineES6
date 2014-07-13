import {Vertex} from './vertex'  //only for comments ?!

export class Mesh
{
    /**
     *
     * @param glContext
     */
    constructor(glContext)
    {
        this.gl = glContext;
        this.vbo = this.gl.createBuffer();      //glGenBuffers(1, &vbo);
        this.size = 0;
    }

    /**
     *
     * @param {Vertex[]} vertices
     */
    addVertices(vertices)
    {
        var gl = this.gl;
        this.size = vertices.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, this.createBuffer(vertices), gl.STATIC_DRAW);
    }

    /**
     *
     * @param vertices
     * @returns {Float32Array}
     */
    createBuffer(vertices) {

        var size = vertices.length * 3;

        var floatVertices = [];
        for(var i = 0; i < vertices.length; i++)
        {
            console.log(vertices[i].getPos());
            floatVertices[i * 3] = vertices[i].getPos().getX();
            floatVertices[i * 3 + 1] = vertices[i].getPos().getY();
            floatVertices[i * 3 + 2] = vertices[i].getPos().getZ();
        }

        return new Float32Array(floatVertices);
    }

    /**
     *
     */
    draw()
    {
        var gl = this.gl;

        gl.enableVertexAttribArray(0);         //pos

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        //glVertexAttribPointer(cast(uint)0, 3, GL_FLOAT, GL_FALSE, 0, null);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        //glDrawArrays(GL_TRIANGLES, 0, cast(int)size);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    //		glDrawArrays(GL_TRIANGLES, 0, 3);

        //PERFORMANCE WARNING: Attribute 0 is disabled. This has signficant performance penalty??
//        gl.disableVertexAttribArray(0);
    }
}