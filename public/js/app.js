const baseURL = "https://api.edamam.com/search?";
const app_key = "d62f0c2724608c401efdf240599ee9bb";
const app_id = "a22ced66";

var ingredientsList = [];
var recipesList = [];
var pickedIndex;

class Recipe{
    constructor(label, imageURL, sourceURL, ingredients){
        this.label = label;
        this.imageURL = imageURL;
        this.sourceURL = sourceURL;
        this.ingredients = ingredients;
    } 
}

function encodeQueryData(data){
    const ret = [];
    for(let d in data)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}

const router = new Router({
        mode: 'history'
});

window.addEventListener('load', () => {
    const loginContent = $('#login-content');
    const searchContent = $('#search-content');
    const recipesListContent = $('#recipes-list-content');
    const recipeDetailedContent = $('#recipe-detailed-content');
    const navigationContainer = $('#navigation-container');
    const searchView = Handlebars.compile($('#search').html());
    const recipesListView = Handlebars.compile($('#recipes-list').html());
    const recipesListItem = Handlebars.compile($('#recipes-list-item').html());
    const recipeDetailsView = Handlebars.compile($('#recipe-details').html());

    router.add('/login.html', () => {
        ;
    });
    
    router.add('/search', () => { 
        navigationContainer.find('#login-navigation').hide();
        navigationContainer.find('#search-navigation').show();
        loginContent.hide(); 
        searchContent.html(searchView()).show();
    });

    router.add('/recipes', () => {
        
        const q = ingredientsList.join(',');
        const ingredientsLimitSpinner = $('#ingredients-limit');
        const preparationTimeSpinner = $('#preparation-time');
        const maxIngredients = ingredientsLimitSpinner.val();
        const preparationTime = preparationTimeSpinner.val();
        
        let urlParams = {app_id: app_id, app_key: app_key, q: q};
        
        if(!isNaN(maxIngredients) && (maxIngredients != ""))
            urlParams.ingr = maxIngredients;
        if(!isNaN(preparationTime) && (preparationTime != ""))
            urlParams.time = preparationTime;
            
        let searchURL = baseURL + encodeQueryData(urlParams);
    
        recipesListContent.append(recipesListView());
       
        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                let recipesListJSON = JSON.parse(this.responseText);
                if(recipesListJSON.hits.length == 0){    
                    alert("There are no results for your search!");
                    router.navigateTo("/search")
                    return;
                }
                recipesListJSON.hits.forEach( (el) => {
                    let label = el.recipe.label;
                    let imageURL = el.recipe.image;
                    let sourceURL = el.recipe.url;
                    let ingredients = el.recipe.ingredientLines;
                    recipesList.push(new Recipe(label, imageURL, sourceURL, ingredients));
                    let context = {label: label,imageURL: imageURL};
                    let html = recipesListItem(context);
                    recipesListContent.append(html);
                })
                recipesListContent.find('a').on('click', aOverrideRecipe);
            }    
        };
        xmlhttp.open('GET',searchURL,true);
        xmlhttp.send();  
        
        searchContent.hide();
        navigationContainer.find('#search-navigation').hide();
  
    });

    router.add('/recipe-details', () => {
        recipesListContent.hide();
        let context = {label: recipesList[pickedIndex-1].label, sourceURL: recipesList[pickedIndex-1].sourceURL,
        imageURL: recipesList[pickedIndex-1].imageURL, ingredients: recipesList[pickedIndex-1].ingredients};
        recipeDetailedContent.html(recipeDetailsView(context)).show();
        
        //code here
    });

// Navigate app to current url
    router.navigateTo(window.location.pathname);

    // Highlight Active Menu on Refresh/Page Reload
    const link = $(`a[href$='${window.location.pathname}']`);
    link.addClass('active');
    
    $('a').on('click', aOverride);
    
    
});

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
    const ingredientsListHolder = $("#ingredients-list");
    const inputValue = $("#ingredients-add").val();
    if(inputValue === "")
        return;
    ingredientsListHolder.append(ingredient(inputValue));
    ingredientsList.push(inputValue);
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
    let index = $(ingredient.parentElement).index();
    ingredient.parentElement.remove();
    arrayRemoveByIndex(ingredientsList, index);
}

function arrayRemoveByIndex(arr, index){
    arr.splice(index,1);
}

function aOverride(event) {
    // Block browser page load
    event.preventDefault();
    // Highlight Active Menu on Click
    const target = $(event.target.parentElement);
    $('.item').removeClass('active');
    target.addClass('active');

    // Navigate to clicked url
    const href = target.attr('href');
    const path = href.substr(href.lastIndexOf('/'));
    router.navigateTo(path);
}

function aOverrideRecipe(event){
     // Block browser page load
    event.preventDefault();
    // Highlight Active Menu on Click
    const target = $(event.target.parentElement);
    $('.item').removeClass('active');
    target.addClass('active');
    pickedIndex = target.parents().eq(1).index();
    
    // Navigate to clicked url
    const href = target.attr('href');
    const path = href.substr(href.lastIndexOf('/'));
    router.navigateTo(path);    
}



