angular.module('Routes', ['ngRoute'])

	.config(['$routeProvider', '$locationProvider',  function($routeProvider, $locationProvider){
		
		$routeProvider 
		
		// Home Route
		.when('/', {
			templateUrl: 'views/pages/home.html'
		})
		
		.when('/login', { 
			templateUrl	: 'views/pages/auth/login.html',
			controller	: 'mainController',
			controllerAs: 'login'
		})
		
		.when('/signup', { 
			templateUrl	: 'views/pages/auth/signup.html',
			controller	: 'userController',
			controllerAs: 'signup'
		})
		.when('/forgot', { 
			templateUrl	: 'views/pages/auth/forgot.html',
			controller 	: 'userController',
			controllerAs: 'forgot'
		})
		.when('/reset/:token', { 
			templateUrl : 'views/pages/auth/reset.html',
			controller	: 'userController',
			controllerAs: 'reset'
		})
		.when('/profile', { 
			templateUrl : 'views/pages/profile.html',
			controller	: 'profileController',
			controllerAs: 'profile'
		})
		.when('/verify/:token', { 
			templateUrl : 'views/pages/auth/verify.html',
			controller	: 'userController',
			controllerAs: 'verify'
		})
		.when('/unsubscribe/:token', { 
			templateUrl : 'views/pages/unsub.html',
			controller	: 'unsubController',
			controllerAs: 'u'
		})
		.when('/news', { 
			templateUrl : 'views/pages/news.html',
			controller	: 'newsController',
			controllerAs: 'news'
		})
		.when('/articles/:slug', { 
			templateUrl : 'views/pages/article.html',
			controller	: 'articleController',
			controllerAs: 'article'
		})
		.when('/activities', { 
			templateUrl : 'views/pages/categories.html',
			controller	: 'activitiesController',
			controllerAs: 'categories'
		})
		.when('/activities/:activity', { 
			templateUrl : 'views/pages/news.html',
			controller	: 'activityController',
			controllerAs: 'news'
		})
		.when('/categories', { 
			templateUrl : 'views/pages/categories.html',
			controller	: 'categoriesController',
			controllerAs: 'categories'
		})
		.when('/categories/:category', { 
			templateUrl : 'views/pages/news.html',
			controller	: 'categoryController',
			controllerAs: 'news'
		})
	
		.when('/admin', { 
			templateUrl : 'views/pages/admin/index.html',
			controller	: 'adminController',
			controllerAs: 'admin', 
			access 		: {
							requiredPermission : ['Admin']
						  }
		})
		.when('/admin/articles', {
			templateUrl : 'views/pages/admin/articles/index.html',
			controller 	: 'adminArticleController',
			controllerAs: 'articles',
			access		: { 
							requiredPermission : ['Admin']
						},
			resolve		: {	
							action : function(){return 'index';}
			}
		})
		.when('/admin/articles/create', {
			templateUrl : 'views/pages/admin/articles/create.html',
			controller 	: 'adminArticleController',
			controllerAs: 'articles',
			access		: { 
							requiredPermission : ['Admin', "Writer"]
						},
			resolve		: {	
							action : function(){return 'create';}
			}
		})
		.when('/admin/articles/edit/:id', {
			templateUrl : 'views/pages/admin/articles/create.html',
			controller 	: 'adminArticleController',
			controllerAs: 'articles',
			access		: { 
							requiredPermission : ['Admin', "Writer"]
						},
			resolve		: {	
							action : function(){return 'edit';}
			}
		})
		.when('/admin/activities', { 
			templateUrl : 'views/pages/admin/keywords.html',
			controller	: 'adminActivitiesController',
			controllerAs: 'kw', 
			access 		: {
							requiredPermission : ['Admin', 'Editor']
						  }
			
		})
		.when('/admin/categories', { 
			templateUrl : 'views/pages/admin/keywords.html',
			controller	: 'adminCategoriesController',
			controllerAs: 'kw', 
			access 		: {
							requiredPermission : ['Admin', 'Editor']
						  }
			
		})
		.when('/about', {
			templateUrl : 'views/pages/about.html'
			
		})
		.when('/contact', {
			templateUrl : 'views/pages/contact.html',
			controller	: 'contactController',
			controllerAs: 'c' 
			
		})
		.when('/jobs', {
			templateUrl : 'views/pages/jobs.html'
			
		})
		.when('/logout', {
			templateUrl : 'views/pages/logout.html'
			
		})
		.when('/401', { 
			templateUrl : 'views/pages/errors/401.html'
		})
		.when('/403', { 
			templateUrl : 'views/pages/errors/403.html'
		})
		.when('/500', { 
			templateUrl : 'views/pages/errors/500.html'
		})
		.when('/404', { 
			templateUrl	: 'views/pages/errors/404.html',
		})
		.otherwise({ 
			redirectTo: "/404"
		});
		
		
			
	// Tidy Up URL's (Remove #)
	$locationProvider.html5Mode(true); 
		
		
	}])
	
	
	.run(['$rootScope', 'toasty', function($rootScope, toasty) {

    // register listener to watch route changes
	    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
		 	
		 	toasty.closeAll();
	               
	    });
	}])

	
	.run( function($rootScope, $location, Token) {

    // register listener to watch route changes
	    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
			
			if (!Token.get() && next.templateUrl === 'views/pages/profile.html'){ 
				
				$location.path("/");
				
			}
			
		
	    	if (Token.get() && (next.templateUrl === 'views/pages/auth/login.html' 
	    					|| next.templateUrl === 'views/pages/auth/signup.html'
							|| next.templateUrl === 'views/pages/auth/forgot.html')) {
				$location.path( "/" );
	        } 
	               
	    });
	})
	
	.run(['$rootScope', '$location', 'Auth', '$window',  function($rootScope, $location, Auth, $window) { 
		
		$rootScope.$on("$routeChangeStart", function(event, next, current){ 
			
			
			
			Auth.pullUser().then(function(response){ 
				
				
				Auth.setUser(response.data);
			
				var role = Auth.getUser().role;

								
				if(role && next.access){
					
					var perms = next.access.requiredPermission;
				
					for(var r = 0; r < perms.length; r++ ){ 
						
						if(role.toString().indexOf(perms[r]) === -1){
							$location.path('/403');
						}
						
						
					}
										
					
				} 

			}).catch(function(){ 
				
				
				if (next.access){
					 
					$location.path( "/login" );
				}else {
					return
				}
				
			});
			
			
			
		});
		
	}]);