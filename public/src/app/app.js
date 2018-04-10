////////////////////////////////////////////////////////
// -------------------------------------------------- //
// ----------- Outsider Guide Angular App ----------- //
// ------------ Dependencies and Config ------------- //
// -------------------------------------------------- //
////////////////////////////////////////////////////////


////////////////////////////////////
// -------- Dependencies -------- //
////////////////////////////////////

angular.module("outsider", [
  				'ngAnimate',
  				'Routes',
  				'ui.bootstrap',
  				'ngStorage',
  				'ngFileUpload',
  				'imageCropper',
  				'angular.filter',
  				'youtube-embed',
  				'720kb.socialshare',
  				'ui.tinymce',
  				'ui.bootstrap.datetimepicker',
  				'angulartics',
  				'angulartics.google.analytics',
  				'angular-loading-bar',
  				
  				'authService',
  				'articleService',
  				'userService',
  				'categoryService',
  				'imageService',
  				'modalService',
  				'activityService',
  				'commentService',
  				'bucketService',
  				'messageService', 
  				
  				'mainCtrl',
  				'userCtrl',
  				'profileCtrl',
  				'newsCtrl',
  				'adminCtrl',
  				'articleCtrl',
  				'imageCtrl',
  				'activityCtrl',
  				'activitiesCtrl',
  				'categoryCtrl',
  				'categoriesCtrl',
  				'unsubCtrl',
  				'contactCtrl',
  				
  				'adminArticleCtrl',
  				'adminCategoriesCtrl',
  				'adminActivitiesCtrl',
  				
  				'commentsDirective',
  				'paginationDirective',
  				'newsletterDirective',
  				'latestArticlesDirective',
  				'toasty',
  				'lazyImage'
  				
  				
  				
])

////////////////////////////////////
// ----------- Config ----------- //
////////////////////////////////////
.directive('fadeIn', function($timeout){
    return {
        restrict: 'A',
        link: function($scope, $element, attrs){
            $element.addClass("ng-hide-remove");
            $element.on('load', function() {
                $element.addClass("ng-hide-add");
            });
        }
    };
})



.config(function($httpProvider) {
// attach our auth interceptor to the http requests
  $httpProvider.interceptors.push('Interceptor');
})
.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}])

.filter('titlecase', function() {
    return function (input) {
        var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

        input = input.toLowerCase();
        return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
            if (index > 0 && index + match.length !== title.length &&
                match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                title.charAt(index - 1).search(/[^\s-]/) < 0) {
                return match.toLowerCase();
            }

            if (match.substr(1).search(/[A-Z]|\../) > -1) {
                return match;
            }

            return match.charAt(0).toUpperCase() + match.substr(1);
        });
    }
});


