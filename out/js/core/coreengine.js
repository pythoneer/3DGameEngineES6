System.register("../../../js/core/game", [], function() {
  "use strict";
  var __moduleName = "../../../js/core/game";
  var Game = function Game() {};
  ($traceurRuntime.createClass)(Game, {
    init: function() {},
    input: function() {},
    update: function() {},
    render: function() {}
  }, {});
  return {get Game() {
      return Game;
    }};
});
System.register("../../../js/core/coreengine", [], function() {
  "use strict";
  var __moduleName = "../../../js/core/coreengine";
  var Game = System.get("../../../js/core/game").Game;
  var CoreEngine = function CoreEngine(width, height, framerate, game) {
    this.isRunning = false;
    this.width = width;
    this.height = height;
    this.framerate = framerate;
    this.game = game;
  };
  ($traceurRuntime.createClass)(CoreEngine, {
    start: function() {
      if (this.isRunning)
        return;
      run();
    },
    stop: function() {
      if (!this.isRunning)
        return;
      this.isRunning = false;
    },
    run: function() {
      window.requestAnimFrame(run, canvas);
      render();
    },
    shaderProgram: function(gl, vs, fs) {
      var prog = gl.createProgram();
      var addshader = function(type, source) {
        var s = gl.createShader((type == 'vertex') ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          throw "Could not compile " + type + " shader:\n\n" + gl.getShaderInfoLog(s);
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
    },
    attributeSetFloats: function(gl, prog, attr_name, rsize, arr) {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
      var attr = gl.getAttribLocation(prog, attr_name);
      gl.enableVertexAttribArray(attr);
      gl.vertexAttribPointer(attr, rsize, gl.FLOAT, false, 0, 0);
    },
    render: function() {
      try {
        var gl = document.getElementById("webgl").getContext("experimental-webgl");
        if (!gl) {
          throw "x";
        }
      } catch (err) {
        throw "Your web browser does not support WebGL!";
      }
      gl.clearColor(0.8, 0.8, 0.8, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      var prog = shaderProgram(gl, "attribute vec3 pos;" + "void main() {" + "	gl_Position = vec4(pos, 2.0);" + "}", "void main() {" + "	gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);" + "}");
      gl.useProgram(prog);
      attributeSetFloats(gl, prog, "pos", 3, [-1, 0, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }, {});
  return {get CoreEngine() {
      return CoreEngine;
    }};
});
System.get("../../../js/core/coreengine" + '');
