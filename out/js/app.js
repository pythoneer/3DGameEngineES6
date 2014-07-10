System.register("../../js/rendering/shader", [], function() {
  "use strict";
  var __moduleName = "../../js/rendering/shader";
  var Shader = function Shader(gl, shaderName) {
    this.gl = gl;
    this.shaderName = shaderName;
    this.program = gl.createProgram();
    if (!this.program) {
      console.log("Shader creation failed: Could not find valid memory location in constructor");
    }
    var self = this;
    setTimeout(function() {
      $.get("./res/shaders/" + self.shaderName + ".vs", function(vsdata) {
        console.log(vsdata);
        $.get("./res/shaders/" + self.shaderName + ".fs", function(fsdata) {
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
  };
  ($traceurRuntime.createClass)(Shader, {
    bind: function() {
      this.gl.useProgram(this.program);
    },
    attributeSetFloats: function(attr_name, rsize, arr) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(arr), this.gl.STATIC_DRAW);
      var attr = this.gl.getAttribLocation(this.program, attr_name);
      this.gl.enableVertexAttribArray(attr);
      this.gl.vertexAttribPointer(attr, rsize, this.gl.FLOAT, false, 0, 0);
    },
    addVertexShader: function(self, text) {
      self.addProgram(self, text, self.gl.VERTEX_SHADER);
    },
    addFragmentShader: function(self, text) {
      self.addProgram(self, text, self.gl.FRAGMENT_SHADER);
    },
    addProgram: function(self, text, type) {
      var shader = self.gl.createShader(type);
      if (!shader) {
        throw "Shader creation failed: Could not find valid memory location when adding shader";
      }
      self.gl.shaderSource(shader, text);
      self.gl.compileShader(shader);
      if (!self.gl.getShaderParameter(shader, self.gl.COMPILE_STATUS)) {
        throw "Could not compile " + type + " shader:\n\n" + self.gl.getShaderInfoLog(shader);
      }
      self.gl.attachShader(self.program, shader);
    }
  }, {});
  return {get Shader() {
      return Shader;
    }};
});
System.register("../../js/core/game", [], function() {
  "use strict";
  var __moduleName = "../../js/core/game";
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
System.register("../../js/core/coreengine", [], function() {
  "use strict";
  var __moduleName = "../../js/core/coreengine";
  var Game = System.get("../../js/core/game").Game;
  var Shader = System.get("../../js/rendering/shader").Shader;
  var CoreEngine = function CoreEngine(width, height, framerate, game, glContext) {
    this.isRunning = false;
    this.width = width;
    this.height = height;
    this.framerate = framerate;
    this.game = game;
    this.canvas = document.getElementById("webgl");
    console.log(glContext);
    this.glContext = glContext;
    this.basicShader = new Shader(glContext, "basic-shader");
  };
  ($traceurRuntime.createClass)(CoreEngine, {
    start: function() {
      console.log("coreengine start");
      if (this.isRunning)
        return;
      this.run();
    },
    stop: function() {
      if (!this.isRunning)
        return;
      this.isRunning = false;
    },
    run: function() {
      var self = this;
      window.requestAnimFrame(function() {
        self.run();
        self.render(self);
      }, this.canvas);
    },
    render: function(self) {
      try {
        var gl = self.glContext;
        if (!gl) {
          throw "x";
        }
      } catch (err) {
        throw "Your web browser does not support WebGL!" + err;
      }
      gl.clearColor(0.8, 0.8, 0.8, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      self.basicShader.bind();
      self.basicShader.attributeSetFloats("pos", 3, [-1, 0, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }, {});
  return {get CoreEngine() {
      return CoreEngine;
    }};
});
System.register("../../js/testgame", [], function() {
  "use strict";
  var __moduleName = "../../js/testgame";
  var Game = System.get("../../js/core/game").Game;
  var TestGame1 = function TestGame1() {
    $traceurRuntime.defaultSuperCall(this, $TestGame1.prototype, arguments);
  };
  var $TestGame1 = TestGame1;
  ($traceurRuntime.createClass)(TestGame1, {init: function() {
      console.log("init testgame1");
    }}, {}, Game);
  return {get TestGame1() {
      return TestGame1;
    }};
});
System.register("../../js/app", [], function() {
  "use strict";
  var __moduleName = "../../js/app";
  var a = "a";
  var TestGame1 = System.get("../../js/testgame").TestGame1;
  var CoreEngine = System.get("../../js/core/coreengine").CoreEngine;
  var element = document.querySelector('#message');
  element.innerHTML = "traceur laeuft";
  var canvas = document.querySelector("#webgl");
  var glContext = canvas.getContext("experimental-webgl");
  var game = new TestGame1();
  var engine = new CoreEngine(100, 100, 60, game, glContext);
  engine.start();
  return {get a() {
      return a;
    }};
});
System.get("../../js/app" + '');
