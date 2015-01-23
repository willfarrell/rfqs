
// Break out of iFrame
/*if(this != top){
  top.location.href = this.location.href;
}*/

//** Global App **//
angular.module('app', []).	// , ['ngSanitize']
config(function($routeProvider) {
	var _view_ = 'view/';
	$routeProvider.
		when('/tender/:tender_ID', 		{templateUrl:_view_+'view.html', 	controller:TenderViewPageCtrl}).
		when('/:company_ID', 	{templateUrl:_view_+'list.html', 	controller:TenderListPageCtrl}).
		otherwise({redirectTo:'/'});
});

//TenderCtrl.$inject = ['$scope', '$filter', '$http', '$routeParams'];
//function TenderCtrl($scope, $filter, $http, $routeParams) {

AppCtrl.$inject = ['$scope', '$http', '$locale', '$routeParams'];
function AppCtrl($scope, $http, $locale, $routeParams) {
	console.log('AppCtrl ('+$scope.$id+')');
	$scope.version = "1.0.0";
	
	$scope.settings = {
		"server":"http://app.rfqs.ca"
	};
	
	//if ($routeParams.company_ID) $cookies.referral = $routeParams.company_ID;
	
	// loading bar percent //
	/*var loader_total = 1, loader_count = 0;
	$scope.preloader = function(name) {
		name || (name = '');
		++loader_count;
		console.log(loader_count+' / '+loader_total+' - '+name);

		if (loader_count == loader_total) {	// hide init
			$('#init').hide();
		} else {	// progress bar
			$('#init .bar').width(((loader_count / loader_total)*100)+'%');
			$('#init span').html(name);
		}
	}
	$scope.preloader('init');*/

	// Events
	$scope.$on('$includeContentLoaded', function(event) {

	});
	//load after $includeContentLoaded
	$scope.$on('$viewContentLoaded', function(event) {

	});

	// Form select options
	$scope.select = {};
	var select_json = ['tender_types', 'categories'];

	for (var i = 0, l = select_json.length; i < l; i++) {
		$http.get('json/'+select_json[i]+'.json', {id:select_json[i]})
			.success(function(data, status, headers, config){
				$scope.select[config.id] = data;
				//$scope.preloader(config.id.replace(/[^0-9a-z]/g, ' '));
			});
	}

	//** load lang file **//
	// $locale.id == 'en-us'
	$scope.loadLanguage = function(lang) {
		$http.get('i18n/'+lang+'/app.json')
			.success(function(data) {
				//console.log(data);
				$scope.lang = data;
				$scope.lang.id = lang;
				//$scope.preloader(lang);
			})
			.error(function(data, status, headers, config) {
				if ($locale.id.length == 2) $scope.loadLanguage('en');	// default
				else $scope.loadLanguage($locale.id.substr(0,2));
			});
	}
	$scope.loadLanguage($locale.id);

	$scope.href = function(url) {
		window.location.href=url;
	}
}

TenderViewPageCtrl.$inject = ['$scope', '$http', '$routeParams'];
function TenderViewPageCtrl($scope, $http, $routeParams) {
	$scope.tender = {};

	$scope.loadTender = function(tender_ID) {
		$http.get($scope.settings.server+'/tender/'+tender_ID).success(function(data) {
			console.log(data);
			$scope.tender = data;
			$scope.tender.categories  = data.categories.split(",");
		});
	};

	$scope.loadTender($routeParams.tender_ID);
}

TenderListPageCtrl.$inject = ['$scope', '$http', '$routeParams'];
function TenderListPageCtrl($scope, $http, $routeParams) {
	$scope.company_ID = $routeParams.company_ID;
	$scope.twitter = $routeParams.twitter;
	$scope.tenders = [];

	$scope.loadTenders = function() {
		$http.get($scope.settings.server+'/tender/company/'+$scope.company_ID)
			.success(function(data) {
				console.log(data);
				if (!data.alerts && !data.errors) {
					$scope.tenders = data;
					setTimeout(function() { $scope.updateCountdown(); }, 50);
				}
			});
	};

	/*$scope.updateCountdown = function() {
		var now = (+new Date)/1000, TotalSeconds = 0;

		for (var i = 0, l = $scope.tenders.length; i < l; i++ ) {
			var tender = $scope.tenders[i];
			var TotalSeconds = Math.floor(tender.close_timestamp/1000-now);
			var str = UpdateCountdown((TotalSeconds < 0) ? TotalSeconds*-1 : TotalSeconds)+""+((TotalSeconds < 0) ? "ago" : "");
			$('#tender_countdown_'+tender.tender_ID).html(str);
		}
	}*/

	$scope.loadTenders();
}

