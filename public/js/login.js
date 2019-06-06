//sign up and register users

function signInWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
       router.navigateTo("/search"); 
    }).catch(function(error) {
      alert("Ups something went wrong: " + error.message);
    });
}

function register(){
    
    const email = document.getElementById("loginForm").elements[0].value;
    const password = document.getElementById("loginForm").elements[1].value;
    
    if(email == "" || password == ""){
        alert("Please fill out both email and password field")
        return;
    }    
        
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
      alert("Your account has been registered, please Sign In to continue");
    }).catch(function(error) {
      alert("Ups something went wrong: " + error.message);
    });
}

function signIn(){
    
    const email = document.getElementById("loginForm").elements[0].value;
    const password = document.getElementById("loginForm").elements[1].value;
    
    if(email == "" || password == ""){
        alert("Please fill out both email and password field")
        return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
        router.navigateTo("/search");
    }).catch(function(error) {
      alert("Ups something went wrong: " + error.message);
    });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $('#user-info').text(user.email);
  } else {
    $('#user-info').text("Not logged in");
  }
})

function signOut(){
    firebase.auth().signOut();
}








