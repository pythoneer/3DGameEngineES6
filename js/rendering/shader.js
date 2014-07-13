
export class Shader {

    /**
     *
     * @param gl
     * @param {string} shaderName - loads the shader source files with this name and *.vs, *.fs extension
     */
    constructor(gl, shaderName) {
        this.gl = gl;
        this.shaderName = shaderName;
        this.program = gl.createProgram();

        if(!this.program) {
            console.log("Shader creation failed: Could not find valid memory location in constructor");
        }

        //fetch shaders with ajax;
        // TODO no chaining; use promises
        var self = this;
        setTimeout(function(){

            $.get( "./res/shaders/" + self.shaderName + ".vs", function( vsdata ) {

                console.log(vsdata);

                $.get( "./res/shaders/" + self.shaderName + ".fs", function( fsdata ) {

                    console.log(fsdata);
                    self.addVertexShader(self, vsdata);
                    self.addFragmentShader(self, fsdata);
                    self.gl.linkProgram(self.program);
                    if (!self.gl.getProgramParameter(self.program, self.gl.LINK_STATUS)) {
                        throw "Could not link the shader program!";
                    }

                }); //fs shader
            }); //vs shader

        }, 20); // timeout

    } // constructor

    /**
     *
     */
    bind() {
        this.gl.useProgram(this.program);
    }

    /**
     *
     * @param {Shader} self
     * @param {string} text - shader sourcecode
     */
    addVertexShader(self, text)
    {
        self.addProgram(self, text, self.gl.VERTEX_SHADER);
    }

    /**
     *
     * @param {Shader} self
     * @param {string} text - shader sourcecode
     */
    addFragmentShader(self, text)
    {
        self.addProgram(self, text, self.gl.FRAGMENT_SHADER);
    }

    /**
     *
     * @param {Shader} self
     * @param {string} text - shader sourcecode
     * @param type - gl.FRAGMENT_SHADER or gl.VERTEX_SHADER
     */
    addProgram(self, text, type)
    {
        var shader = self.gl.createShader(type);

        if(!shader) {
            throw"Shader creation failed: Could not find valid memory location when adding shader";
        }

        self.gl.shaderSource(shader, text);
        self.gl.compileShader(shader);

        if (!self.gl.getShaderParameter(shader, self.gl.COMPILE_STATUS)) {
            throw "Could not compile "+type+
                " shader:\n\n"+self.gl.getShaderInfoLog(shader);
        }

        self.gl.attachShader(self.program, shader);
    }
}