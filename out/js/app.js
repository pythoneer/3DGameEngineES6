System.register("../../js/core/vector3f", [], function() {
  "use strict";
  var __moduleName = "../../js/core/vector3f";
  var Vector3f = function Vector3f(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  };
  var $Vector3f = Vector3f;
  ($traceurRuntime.createClass)(Vector3f, {
    length: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    dot: function(r) {
      return this.x * r.getX() + this.y * r.getY() + this.z * r.getZ();
    },
    cross: function(r) {
      var x_ = this.y * r.getZ() - this.z * r.getY();
      var y_ = this.z * r.getX() - this.x * r.getZ();
      var z_ = this.x * r.getY() - this.y * r.getX();
      return new $Vector3f(x_, y_, z_);
    },
    normalize: function() {
      var length = length();
      this.x /= length;
      this.y /= length;
      this.z /= length;
      return this;
    },
    rotate: function() {
      return null;
    },
    addv: function(r) {
      return new $Vector3f(this.x + r.getX(), this.y + r.getY(), this.z + r.getZ());
    },
    addf: function(r) {
      return new $Vector3f(this.x + r, this.y + r, this.z + r);
    },
    subv: function(r) {
      return new $Vector3f(this.x - r.getX(), this.y - r.getY(), this.z - r.getZ());
    },
    subf: function(r) {
      return new $Vector3f(this.x - r, this.y - r, this.z - r);
    },
    mulv: function(r) {
      return new $Vector3f(this.x * r.getX(), this.y * r.getY(), this.z * r.getZ());
    },
    mulf: function(r) {
      return new $Vector3f(this.x * r, this.y * r, this.z * r);
    },
    divv: function(r) {
      return new $Vector3f(this.x / r.getX(), this.y / r.getY(), this.z / r.getZ());
    },
    divf: function(r) {
      return new $Vector3f(this.x / r, this.y / r, this.z / r);
    },
    getX: function() {
      return this.x;
    },
    setX: function(x) {
      this.x = x;
    },
    getY: function() {
      return this.y;
    },
    setY: function(y) {
      this.y = y;
    },
    getZ: function() {
      return this.z;
    },
    setZ: function(z) {
      this.z = z;
    }
  }, {});
  return {get Vector3f() {
      return Vector3f;
    }};
});
System.register("../../js/rendering/vertex", [], function() {
  "use strict";
  var __moduleName = "../../js/rendering/vertex";
  var Vertex = function Vertex(pos) {
    this.pos = pos;
    this.SIZE = 3;
  };
  ($traceurRuntime.createClass)(Vertex, {
    getPos: function() {
      return this.pos;
    },
    setPos: function(pos) {
      this.pos = pos;
    }
  }, {});
  return {get Vertex() {
      return Vertex;
    }};
});
System.register("../../js/rendering/mesh", [], function() {
  "use strict";
  var __moduleName = "../../js/rendering/mesh";
  var Vertex = System.get("../../js/rendering/vertex").Vertex;
  var Mesh = function Mesh(glContext) {
    this.gl = glContext;
    this.vbo = this.gl.createBuffer();
    this.size = 0;
  };
  ($traceurRuntime.createClass)(Mesh, {
    addVertices: function(vertices) {
      var gl = this.gl;
      this.size = vertices.length;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      gl.bufferData(gl.ARRAY_BUFFER, this.createBuffer(vertices), gl.STATIC_DRAW);
    },
    createBuffer: function(vertices) {
      var size = vertices.length * 3;
      var floatVertices = [];
      for (var i = 0; i < vertices.length; i++) {
        console.log(vertices[$traceurRuntime.toProperty(i)].getPos());
        $traceurRuntime.setProperty(floatVertices, i * 3, vertices[$traceurRuntime.toProperty(i)].getPos().getX());
        $traceurRuntime.setProperty(floatVertices, i * 3 + 1, vertices[$traceurRuntime.toProperty(i)].getPos().getY());
        $traceurRuntime.setProperty(floatVertices, i * 3 + 2, vertices[$traceurRuntime.toProperty(i)].getPos().getZ());
      }
      return new Float32Array(floatVertices);
    },
    draw: function() {
      var gl = this.gl;
      gl.enableVertexAttribArray(0);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }, {});
  return {get Mesh() {
      return Mesh;
    }};
});
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
    }, 20);
  };
  ($traceurRuntime.createClass)(Shader, {
    bind: function() {
      this.gl.useProgram(this.program);
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
  var Mesh = System.get("../../js/rendering/mesh").Mesh;
  var Vertex = System.get("../../js/rendering/vertex").Vertex;
  var Vector3f = System.get("../../js/core/vector3f").Vector3f;
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
    this.simpleMesh = new Mesh(glContext);
    var vertecies = [new Vertex(new Vector3f(-1, 0, 0)), new Vertex(new Vector3f(0, 1, 0)), new Vertex(new Vector3f(0, -1, 0)), new Vertex(new Vector3f(1, 0, 0))];
    this.simpleMesh.addVertices(vertecies);
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
      var gl = self.glContext;
      try {
        if (!gl) {
          throw "x";
        }
      } catch (err) {
        throw "Your web browser does not support WebGL!" + err;
      }
      gl.clearColor(0.8, 0.8, 0.8, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      self.basicShader.bind();
      this.simpleMesh.draw();
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
