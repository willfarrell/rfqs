
BuyerCtrl.$inject = ['$scope', '$http'];
function BuyerCtrl($scope, $http) {
	$scope.tenders = [];
	
	$scope.search = '';
	
	$scope.now = +new Date();
	setTimeout(function(){ $scope.now = +new Date(); }, 60000);
	/*$scope.regenHash = function(option) {	// true / false / else
		$http.get('/company/hash/'+option)
			.success(function(data) {
				console.log(data);

				$scope.hash = JSON.parse(data);
			});
	};*/
	//$scope.hash = $scope.regenHash();

	$scope.loadTenders = function() {
		$http.get('/tender/company/')
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
	
	
	
	
	$scope.loadTenders();
}

