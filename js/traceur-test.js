export class Greeter {
    constructor(message) {
        this.message = message;
    }

    greet() {
        var element = document.querySelector('#message');
        element.innerHTML = this.message;
    }
};

//var greeter = new Greeter('Hello, world!');
//greeter.greet();
//
//console.log("das ist ein test");
//
//var map = new Map();
//map.set("a", 1);
//map.set("b", 2);
//map.set("c", 3);
//
//console.log("get b:");
//console.log(map.get("b"));

//for (var v in map.values()) {
//    console.log(v);
//}
//
//for (var k in map.keys()) {
//    console.log(k);
//}

console.log("start");

var canvas = document.querySelector('#webgl');
console.log(canvas);

//var gl = canvas.getContext("experimental-webgl");
//console.log(gl);