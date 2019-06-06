const baseURL = "https://api.edamam.com/search?";
const app_key = "d62f0c2724608c401efdf240599ee9bb";
const app_id = "a22ced66";

var ingredientsList = [];
var recipesList = [];
var pickedIndex;
var historyArr = [];

function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

class Recipe{
    constructor(label, imageURL, sourceURL, ingredients){
        this.label = label;
        this.imageURL = imageURL;
        this.sourceURL = sourceURL;
        this.ingredientsList = ingredients;
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
    const favoritesListView = Handlebars.compile($('#recipes-favorites').html());
    const recipesListItem = Handlebars.compile($('#recipes-list-item').html());
    const recipeDetailsView = Handlebars.compile($('#recipe-details').html());
    
    
    router.add('/login.html', () => {
        searchContent.hide();
        loginContent.show();
        navigationContainer.find('#search-navigation').hide();
        navigationContainer.find('#login-navigation').show(); 
        historyArr.push('/login.html')
    });
    
    router.add('/back', ()=> {
        console.log(historyArr);
        if(historyArr.length <= 1)
            return;
        historyArr.pop();
        router.navigateTo(historyArr.pop());
    })
    
    router.add('/search', () => { 
        navigationContainer.find('#login-navigation').hide();
        navigationContainer.find('#search-navigation').show();
        loginContent.hide(); 
        searchContent.html(searchView()).show();
        historyArr.push('/search');
    });
    
    router.add('/favorites',() => {
     
        var currUser = firebase.auth().currentUser;
        if (currUser === null) {
            alert("Sign in to view favorites")
            router.navigateTo("/login.html");
            return;
        }   
        
        navigationContainer.hide();
        loginContent.hide();
        searchContent.hide();
        recipeDetailedContent.hide();
        recipesListContent.html(favoritesListView());

        var db = firebase.firestore();
        db.collection("users").doc(currUser.uid).get().then((ds) => {
            if (ds.exists) {
                let favoritesList = ds.get('recipes')
                favoritesList.forEach((recipe) => {
                    let context = {label: recipe.label, imageURL: recipe.imageURL};
                    let html = recipesListItem(context);
                    recipesListContent.append(html);
                })
                recipesList = favoritesList;
                recipesListContent.find('a').on('click', aOverrideRecipe);
            } else{
                recipesListContent.append("<p class=\"mt-3 text-center\">You do not have any favorite recipes</p>");
            }
        }).catch((error) => {
            alert("Upps Something went wrong: " + error);
        }); 
        historyArr.push('/favorites');
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
    
        recipesListContent.html(recipesListView());
       
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
        historyArr.push('/recipes');
    });

    router.add('/recipe-details', () => {
        recipesListContent.hide();
        let context = {label: recipesList[pickedIndex-1].label, sourceURL: recipesList[pickedIndex-1].sourceURL,
        imageURL: recipesList[pickedIndex-1].imageURL, ingredients: recipesList[pickedIndex-1].ingredientsList};
        recipeDetailedContent.html(recipeDetailsView(context)).show();
        recipeDetailedContent.find('#add-to-favorites').on('click', function(){addToFavorites(recipesList[pickedIndex-1])})
        historyArr.push('/recipes-details');
        //code here
    });

    //Navigate app to current url
    router.navigateTo(window.location.pathname);

    // Highlight Active Menu on Refresh/Page Reload
    const link = $(`a[href$='${window.location.pathname}']`);
    link.addClass('active');
    
    //add link overrides
    navigationContainer.find('#login-navigation').on('click', aOverride);
    navigationContainer.find('#search-navigation').on('click', aOverride);
    $('#back-button').on('click', aOverride);
    $('#show-favorites').on('click', aOverride);
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
    let target
    if($(event.target).is('a'))
        target = $(event.target);
    else
        target = $(event.target.parentElement);
    //$('.item').removeClass('active');
    //target.addClass('active');

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



