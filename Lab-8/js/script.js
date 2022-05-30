(function () {
  var names = ["Bill", "John", "Jen", "Jason", "Paul", "Frank", "Steven", "Larry", "Paula", "Laura", "Jim"];

  for (var i = 0; i < names.length; i++) {
    let personNameLowerCase = names[i].toLowerCase();
    if (personNameLowerCase.charAt(0) === "j") {
      byePersonObject.speak(names[i]);
    } else {
      greetPersonObject.speak(names[i]);
    }
  }
})();