(function () {
  console.log("Main task results:");
  let names = ["Bill", "John", "Jen", "Jason", "Paul", "Frank", "Steven", "Larry", "Paula", "Laura", "Jim"];

  for (var i = 0; i < names.length; i++) {
    let personNameLowerCase = names[i].toLowerCase();
    if (personNameLowerCase.charAt(0) === 'j') {
      byePersonObject.speak(names[i]);
    } else {
      greetPersonObject.speak(names[i]);
    }
  }
})();

(function () {
  console.log("\n");
  console.log("Additional task results:");
  console.log("This snippet of code \"says\" hello to people whose name ends with 'r' or 'a':");
  let names = ["James", "John", "Robert", "Mary", "Donald", "Jennifer", "Barbara", "Larry", "Laura", "Jessica"];
  
  for (var i = 0; i < names.length; i++) {
    let personNameLowerCase = names[i].toLowerCase();
    if (personNameLowerCase.charAt(names[i].length - 1) !== 'r' &&
        personNameLowerCase.charAt(names[i].length - 1) !== 'a') {
      byePersonObject.speak(names[i]);
    } else {
      greetPersonObject.speak(names[i]);
    }
  }
})()