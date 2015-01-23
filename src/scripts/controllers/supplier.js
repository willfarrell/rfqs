
SupplierCtrl.$inject = ['$scope', '$http'];
function SupplierCtrl($scope, $http) {
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
	/*
	// get all alerts (of type id_type = 'tender')
	$http.get('/alert/tender')
		.success(function(data) {
			console.log(data);

			$scope.alerts = data;
		});

	// mark alert as read
	$scope.alert_read = function(alert_ID) {
		$http.get('/alert/read/'+alert_ID);

		// may have to remove alert from array here
	}
	*/
	$scope.loadTenders = function() {
		$http.get('/tender/follow/')
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