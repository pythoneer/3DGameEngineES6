export var a = "a";
//traceur.options.experimental = true;

import {TestGame1} from './testgame';
import {CoreEngine} from './core/coreengine'


var element = document.querySelector('#message');
element.innerHTML = "traceur laeuft";

var canvas = document.querySelector("#webgl");
//console.log(canvas);

var glContext = canvas.getContext("experimental-webgl");
//console.log(glContext);

var game = new TestGame1();

var engine = new CoreEngine(100, 100, 60, game, glContext);
engine.start();


