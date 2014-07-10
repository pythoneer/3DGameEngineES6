
export class Shader {
    constructor(gl, shaderName) {
        this.gl = gl;
        this.shaderName = shaderName;
        this.program = gl.createProgram();

        if(!this.program) {
            console.log("Shader creation failed: Could not find valid memory location in constructor");
        }

        //fetch shaders with ajax;
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

                });

            });
        }, 200);

    }

    bind() {
        this.gl.useProgram(this.program);
    }

    attributeSetFloats(attr_name, rsize, arr) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(arr), this.gl.STATIC_DRAW);
        var attr = this.gl.getAttribLocation(this.program, attr_name);
        this.gl.enableVertexAttribArray(attr);
        this.gl.vertexAttribPointer(attr, rsize, this.gl.FLOAT, false, 0, 0);
    }

    addVertexShader(self, text)
    {
        self.addProgram(self, text, self.gl.VERTEX_SHADER);
    }

    addFragmentShader(self, text)
    {
        self.addProgram(self, text, self.gl.FRAGMENT_SHADER);
    }

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