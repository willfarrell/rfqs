
SearchCtrl.$inject = ['$scope', '$http', '$routeParams'];
function SearchCtrl($scope, $http, $routeParams) {
	$scope.alerts = [];
	$scope.tenders = [];
	$scope.search = {
		search_ID:0,
		type:'',
		keyword:'',
		categories:[],
		order_by:'close_timestamp',
		per_page:20
	};
	$scope.now = +new Date();
	setTimeout(function(){ $scope.now = +new Date(); }, 60000);

	$scope.searchTenders = function(page) {
		console.log('searchTenders(page)');
		page || (page = 0);
		$http.post($rootScope.settings.server+'tender/search/'+page, $scope.search)
			.success(function(data) {
				console.log(data);
				if (data.alerts) {
					$rootScope.alerts = data.alerts;
					$scope.tenders = [];
				} else {
					$scope.alerts = [];

					for (var i = 0, l = data.length; i < l; i++) {
						data[i].post_timestamp 		*= 1000;
						data[i].question_timestamp 	*= 1000;
						data[i].close_timestamp 	*= 1000;
						data[i].timestamp_update 	*= 1000;
						if (page) $scope.tenders.push(data[i]);
					}
					
					if (!page) $scope.tenders = data;
					//setTimeout(function(){ $scope.updateCountdown(); },50);
				}
			});
	}
	
	$scope.loadTenders = function(company_ID) {
		$http.get($rootScope.settings.server+'tender/company/'+company_ID)
			.success(function(data) {
				console.log(data);
				
				for (var i = 0, l = data.length; i < l; i++) {
					data[i].post_timestamp 		*= 1000;
					data[i].question_timestamp 	*= 1000;
					data[i].close_timestamp 	*= 1000;
					data[i].timestamp_update 	*= 1000;
				}
				
				$scope.tenders = data;
				//setTimeout(function(){ $scope.updateCountdown(); },50);
			});
	};
}
