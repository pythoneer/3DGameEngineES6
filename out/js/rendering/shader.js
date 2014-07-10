System.register("../../../js/rendering/shader", [], function() {
  "use strict";
  var __moduleName = "../../../js/rendering/shader";
  var Shader = function Shader(gl, shaderName) {
    this.gl = gl;
    this.shaderName = shaderName;
    this.program = gl.createProgram();
    if (this.program == 0) {
      console.log("Shader creation failed: Could not find valid memory location in constructor");
    }
    $.get("./res/shaders/" + this.shaderName + ".vs", function(vsdata) {
      console.log(vsdata);
      $.get("./res/shaders/" + this.shaderName + ".vs", function(fsdata) {
        console.log(vsdata);
      });
    });
  };
  ($traceurRuntime.createClass)(Shader, {
    addVertexShader: function(text) {
      addProgram(text, gl.VERTEX_SHADER);
    },
    addFragmentShader: function(text) {
      addProgram(text, gl.FRAGMENT_SHADER);
    },
    addProgram: function(text, type) {
      var shader = gl.createShader(type);
      if (!shader) {
        writeln("Shader creation failed: Could not find valid memory location when adding shader");
        Runtime.terminate();
      }
      gl.shaderSource(shader, text);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw "Could not compile " + type + " shader:\n\n" + gl.getShaderInfoLog(s);
      }
      glAttachShader(program, shader);
    }
  }, {});
  return {get Shader() {
      return Shader;
    }};
});
System.get("../../../js/rendering/shader" + '');
