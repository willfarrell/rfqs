//angular.module('app.controller.nda', [])
//.controller('NdaCtrl', ['$scope', '$http', function($scope, $http) {
NdaCtrl.$inject = ['$scope', '$http'];
function NdaCtrl($scope, $http) {
	console.log('NdaCtrl ('+$scope.$id+')');
	
	$scope.nda = {
		nda_ID:0,
		nda_details:""
	};

	$scope.loadNDA = function(nda_ID) {
		console.log('loadNDA('+nda_ID+')');
		
		nda_ID || (nda_ID = 0);
		
		var http_config = {
            'method':'get', // get,head,post,put,delete,jsonp
            'url':$rootScope.settings.server+'/nda/'+nda_ID,
            'data':{}
        },
	    http_callback = function(data, status, headers, config) {
            $scope.nda = data;
        };
        
		$http(http_config)
			.success(function(data, status, headers, config) {
				console.log('loadNDA.get.success');
				if ($rootScope.checkHTTPReturn(data)) {
					//$rootScope.offline.save_data(http_config, data, callback);
					http_callback(data, status, headers, config);
				}
			})
			.error(function(data, status) {
			    console.log('loadNDA.get.error');
				$rootScope.http_error();
				//$rootScope.offline.load_data(http_config, data, callback); // Load expected data from offline DB
			});
	};

	$scope.saveNDA = function() {
		console.log('saveNDA()');
		
		var http_config = {
            'method':'put', // get,head,post,put,delete,jsonp
            'url':$rootScope.settings.server+'/nda',
            'data':$scope.nda
        },
	    http_callback = function(data, status, headers, config) {
            if (data.nda_ID) {
	            $scope.nda.nda_ID = data.nda_ID;
				$rootScope.alerts = [{'class':'success', 'label':'NDA:', 'message':'Saved'}];
            }
        };
        
        $http(http_config)
			.success(function(data, status, headers, config) {
				console.log('saveNDA.post.success');
				if ($rootScope.checkHTTPReturn(data)) {
					http_callback(data, status, headers, config);
				}
			})
			.error(function(data, status) {
			    console.log('saveNDA.post.error');
				$rootScope.http_error();
				$rootScope.offline.que_request(http_config, http_callback);
			});

	};
	
	// require_signin called by parent settings
	$scope.loadNDA();
}
//}]);
