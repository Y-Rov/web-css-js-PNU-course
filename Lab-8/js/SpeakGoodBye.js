(function (window){
  var byePersonObject = {};
  byePersonObject.speakWord = "Goodbye";
  
  byePersonObject.speak = function (name) {
    console.log(byePersonObject.speakWord + " " + name);
  }

  window.byePersonObject = byePersonObject;
})(window);



