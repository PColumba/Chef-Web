
var ingredientsListHolder;
var ingredientsInputField;

function ingredient(value){
    return "<span class=\"badge badge-primary\" style=\"margin-right: 5px;\">" + value + "  " + 
            "<i class=\"fas fa-times\" onclick=\"removeIngredient(this)\"></i></span>";
}

window.onload = function() {
    ingredientsListHolder = document.getElementById("ingredients-list");
    document.getElementById("ingredients-add").addEventListener("keydown",addIngredientWithEnter);
};

function addIngredient(){
    const inputValue = document.getElementById("ingredients-add").value;
    if(inputValue === "")
        return;
    window.ingredientsListHolder.innerHTML += ingredient(inputValue);    
}

function addIngredientWithEnter(ev){
    const keyPressed = ev.key;
    if(keyPressed === "Enter"){
        const inputValue = document.getElementById("ingredients-add").value;
        window.ingredientsListHolder.innerHTML += ingredient(inputValue);  
        ev.preventDefault();
    }
    else{
        return;
    }
}

function removeIngredient(ingredient){
    ingredient.parentElement.remove();
}



