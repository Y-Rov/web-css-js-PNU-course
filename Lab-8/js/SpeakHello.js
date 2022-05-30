(function (window) {
  var greetPersonObject = {};
  greetPersonObject.speakWord = "Hello";
  
  greetPersonObject.speak = function (name) {
    console.log(greetPersonObject.speakWord + " " + name);
  }

  window.greetPersonObject = greetPersonObject;
})(window);



