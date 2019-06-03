window.addEventListener('load', () => {
    const loadContent = $('#loaded-content');
    const hideContent = $('#hide-content');
    var searchView;
    var recipesListView;
    var recipeDetailsView;
    
    //const recipesListTemplate = Handlebars.compile($('#recipes-list').html());
    (function compileTemplates() {
        $.get('hbs-templates/search.hbs', function (data) {
            searchView = Handlebars.compile(data); 
        }, 'html');
        $.get('hbs-templates/recipes-list.hbs', function (data) {
            recipesListView = Handlebars.compile(data); 
        }, 'html');
        $.get('hbs-templates/recipe-details.hbs', function (data) {
            recipeDetailsView = Handlebars.compile(data); 
        }, 'html');
    })()
    
    
    const router = new Router({
        mode: 'history'
    });

    router.add('/', () => {
    });
    
     router.add('/search', () => {
         console.log("triggered");
         hideContent.hide();
         loadContent.html(searchView);
        //code here
    });

    router.add('/recipe-details', () => {
        //code here
    });

    router.add('/recipes-list', () => {
       //code here
       //example: el.html(html);
    });

// Navigate app to current url
    router.navigateTo(window.location.pathname);

    // Highlight Active Menu on Refresh/Page Reload
    const link = $(`a[href$='${window.location.pathname}']`);
    link.addClass('active');

    $('a').on('click', (event) => {
        // Block browser page load
        event.preventDefault();

        // Highlight Active Menu on Click
        const target = $(event.target);
        $('.item').removeClass('active');
        target.addClass('active');

        // Navigate to clicked url
        const href = target.attr('href');
        const path = href.substr(href.lastIndexOf('/'));
        router.navigateTo(path);
    });
});

