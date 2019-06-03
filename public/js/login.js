//sign up and register users

function register(){
    
    const email = document.getElementById("loginForm").elements[0].value;
    const password = document.getElementById("loginForm").elements[1].value;
   
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
      alert("Your account has been registered");
    }).catch(function(error) {
      alert("Ups something went wrong: " + error.message);
    });
}

function signIn(){
    
    const email = document.getElementById("loginForm").elements[0].value;
    const password = document.getElementById("loginForm").elements[1].value;
    
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      alert("Ups something went wrong: " + error.message);
    });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  } else {
   alert("You have signed off")
  }
});




