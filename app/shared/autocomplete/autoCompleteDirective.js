app.directive('autoCompleteSearch', function () {
    return {
        restrict : 'A',
        scope : {
            searchQuery : "="
        },
        link : function (scope, elements, attrs) {
            var $ = require('jquery'),
                autoComplete = require('jquery-ui/autocomplete');

            elements.autocomplete();
        }
    }
});