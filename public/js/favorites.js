
function addToFavorites(recipe){
    var currUser = firebase.auth().currentUser;
    if(currUser === null){
        alert("Sign in to add recipes");
        return;
    }
    else{
        var db = firebase.firestore();
        var data = Object.assign({},recipe)
        db.collection("users").doc(currUser.uid).get().then((ds) => {
            if(ds.exists){
                ds.ref.update({'recipes': firebase.firestore.FieldValue.arrayUnion(data)}).then(() => {
                    alert("Recipe has been added to favorites");
                }).catch((error) => {
                    alert("Upps Something went wrong");
                })
            }
            else{
                ds.ref.set({'recipes': [data]});
                alert("Recipe has been added to favorites");
            }    
        }).catch((error) => {
            console.log("Upps something went wrong" + error);
        });
    }     
}





