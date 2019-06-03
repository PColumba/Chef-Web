
function ingredient(value){
    return "<span class=\"badge badge-primary\" style=\"margin-right: 5px;\">" + value + "  " + 
            "<i class=\"fas fa-times\" onclick=\"removeIngredient(this)\"></i></span>";
}

//Not critical, not working with external templates
/*(function() {
    console.log('I was triggered');
    ingredientsListHolder = document.getElementById("ingredients-list");
    document.getElementById("ingredients-add").addEventListener("keydown",addIngredientWithEnter);
})();*/

function addIngredient(){
    const ingredientsListHolder = document.getElementById("ingredients-list");
    const inputValue = document.getElementById("ingredients-add").value;
    if(inputValue === "")
        return;
    ingredientsListHolder.innerHTML += ingredient(inputValue);    
}


//Not critical, not working with external templates
/*function addIngredientWithEnter(ev){
    const keyPressed = ev.key;
    if(keyPressed === "Enter"){
        const inputValue = document.getElementById("ingredients-add").value;
        window.ingredientsListHolder.innerHTML += ingredient(inputValue);  
        ev.preventDefault();
    }
    else{
        return;
    }
}*/

function removeIngredient(ingredient){
    ingredient.parentElement.remove();
}



