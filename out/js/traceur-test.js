System.register("../../js/traceur-test", [], function() {
  "use strict";
  var __moduleName = "../../js/traceur-test";
  var Greeter = function Greeter(message) {
    this.message = message;
  };
  ($traceurRuntime.createClass)(Greeter, {greet: function() {
      var element = document.querySelector('#message');
      element.innerHTML = this.message;
    }}, {});
  ;
  console.log("start");
  var canvas = document.querySelector('#webgl');
  console.log(canvas);
  return {get Greeter() {
      return Greeter;
    }};
});
System.get("../../js/traceur-test" + '');
