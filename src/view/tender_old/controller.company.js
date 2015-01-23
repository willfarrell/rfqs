
//** Company **//
function CompanyCtrl($scope, $http) {
	console.log('CompanyCtrl');

	$scope.alerts = {
		company:[]
	};
	$scope.errors = {

	};
	$scope.company = {};
	$scope.users = {};

	$scope.updateCompany = function() {

		if ($scope.company.company_ID) {	// update
			$http.put($scope.settings.server+'company/', $scope.company)
				.success(function(data) {
					console.log(data);
					$scope.errors 		= (data.errors) ? data.errors : {};
					$scope.alerts.user 	= (data.alerts) ? data.alerts : [];
					if (!data.alerts && !data.errors) {
						$rootScope.session.company = $scope.company;
						$rootScope.saveSession();
						console.log($rootScope.session);
						$scope.alerts.company.push({'class':'success', label:'Saved'});
					}
				})
				.error(function() {
					$rootScope.http_error();
				});
		} else {	// create
			$http.post($scope.settings.server+'company/', $scope.company)
				.success(function(data) {
					console.log(data);
					$scope.errors 		= (data.errors) ? data.errors : {};
					$scope.alerts.user 	= (data.alerts) ? data.alerts : [];
					if (!data.alerts && !data.errors) {
						$scope.company.company_ID = data;
						$rootScope.session.company = $scope.company;
						db.set('session', $rootScope.session);
						console.log($rootScope.session);
						$scope.alerts.company.push({'class':'success', 'label':'Saved'});
					}
				})
				.error(function() {
					$rootScope.http_error();
				});
		}
	};


	$scope.loadUsers = function() {

		$http.get($scope.settings.server+'company/user/').success(function(data) {
			console.log(data);
			$scope.errors.user	= (data.errors) ? data.errors : {};
			$scope.alerts.user 	= (data.alerts) ? data.alerts : [];
			if (!data.alerts && !data.errors) {
				$scope.users = data;
			}
		})
		.error(function() {
			$rootScope.http_error();
		});
	};


	$scope.require_signin(function(){
		console.log('CompanyCtrl require_signin');
		console.log($rootScope.session.company);
		$scope.company = $rootScope.session.company ? $rootScope.session.company : {
			company_ID:$rootScope.session.company_ID,
			country_code:$rootScope.country_code.toUpperCase()
		};
	});
}
CompanyCtrl.$inject = ['$scope', '$http'];


//** Company **//
function CompanyViewPageCtrl($scope, $http, $routeParams) {
	$scope.alerts = [];
	$scope.company = {};
	$scope.tenders = [];
	$scope.following = false;

	$scope.phone = "";
	$scope.email = "";

	$http.get('/company/view/'+$routeParams.company_ID)
		.success(function(data) {
			console.log(data);
			data.categories = data.categories.split(",");
			if(typeof(data.categories) != "array") data.categories = [data.categories];
			$scope.company = data;
			/*$http.get('/company/user/'+data.user_ID)
				.success(function(data) {
					console.log(data);
					$scope.company.user = data;
				});*/
			/*$http.get('/company/location/'+data.location_ID)
				.success(function(data) {
					console.log(data);
					$scope.company.location = data;
				});*/

		});
	$http.get('/tender/company/'+$routeParams.company_ID)
		.success(function(data) {
			console.log(data);
			$scope.tenders = data;
			setTimeout(function() { $scope.updateCountdown(); }, 50);
		});

	$scope.follow = function(id, group) {
		group || (group = '');
		$scope.following = true;
		$http.get('/company/follow/'+id+'/'+group);
	};

	$scope.unfollow = function(id) {
		$scope.following = false;
		$http.delete('/company/follow/'+id);
	};

	$scope.updateCountdown = function() {
		var now = (+new Date)/1000, TotalSeconds = 0;

		for (var i = 0, l = $scope.tenders.length; i < l; i++ ) {
			var tender = $scope.tenders[i];
			var TotalSeconds = Math.floor(tender.close_timestamp/1000-now);
			var str = UpdateCountdown((TotalSeconds < 0) ? TotalSeconds*-1 : TotalSeconds)+""+((TotalSeconds < 0) ? "ago" : "");
			console.log(str);
			$('#tender_countdown_'+tender.tender_ID).html(str);
		}
	};

}
CompanyViewPageCtrl.$inject = ['$scope', '$http', '$routeParams'];


function CompanyEditPageCtrl($scope, $http, $compile, $routeParams) {
	$scope.alerts = [];
	$scope.errors = {};

	$scope.company = $scope.companies[$scope.session.company_ID];	// company form
	$scope.user = {};		// user form
	$scope.location = {};	// locations form

	$scope.phone = "";
	$scope.email = "";

	// tabs
	$scope.tab_nav = function(id) {
		var ids = ['view', 'edit', 'users'];
		// unset all
		for (var i = 0, l = ids.length; i < l; i++) {
			$('#tab_'+ids[i]).hide();
			$('#tab_nav_'+ids[i]).removeClass("active");
		}
		// set id
		$('#tab_'+id).show();
		$('#tab_nav_'+id).addClass("active");
	};
	$scope.tab_nav($routeParams.page);

	//-- buttons --//
	$scope.button = {};
	$scope.button.new_location = function() { $scope.location = {country_code:$rootScope.locations[$scope.company.location_ID].country_code}; $('#locations').hide(); $('#edit_location').show(); };
	$scope.button.edit_location = function(id) { $scope.location = $scope.company.locations[id]; $('#locations').hide(); $('#edit_location').show(); };
	$scope.button.locations = function() { $('#locations').show(); $('#edit_location').hide(); };
	$scope.button.locations();

	$scope.button.new_user = function() { $scope.user = {}; $('#users').hide(); $('#edit_user').show(); };
	$scope.button.edit_user = function(id) { $scope.user = $scope.company.users[id]; $('#users').hide(); $('#edit_user').show(); };
	$scope.button.users = function() { $('#users').show(); $('#edit_user').hide(); };
	$scope.button.users();
	//$("#company_fax_test").mask("(999) 999-9999");


	// tagging
	/*$('#tags').tagsInput({
	   //'autocomplete_url': url_to_autocomplete_api,
	   //'autocomplete': {selectFirst:true,width:'100px',autoFill:true},
	   'height':'100px',
	   'width':'auto',
	   'interactive':true,
	   'defaultText':'add a tag',
	   //'onAddTag':callback_function,
	   //'onRemoveTag':callback_function,
	   //'onChange' : callback_function,
	   'removeWithBackspace' : true,
	   'minChars' : 0,
	   'maxChars' : 0, //if not provided there is no limit,
	   'placeholderColor' : '#666666'
	});*/
	$("#company_phone").mask("(999) 999-9999");
	$("#company_fax").mask("(999) 999-9999");

	$("#user_phone").mask("(999) 999-9999? x99999");
	$("#user_cell").mask("(999) 999-9999");
	$("#user_fax").mask("(999) 999-9999");

	$("#location_phone").mask("(999) 999-9999");
	$("#location_fax").mask("(999) 999-9999");

	$http.get('/company/edit')
		.success(function(data) {
			console.log(data);
			if (data.alerts) $scope.alerts = data.alerts;
			if (data.errors) $scope.errors = data.errors;
			if (!data.alerts && !data.errors) {
				data.categories = data.categories.split(",");
				if(typeof(data.categories) != "array") data.categories = [data.categories];

				data.user = $scope.users[data.user_ID];
				data.location = $scope.locations[data.location_ID];

				$scope.company = data;

				//$('#tags').importTags(data.tags);	// custom element
				//$("#company_phone").focus();
				//$("#company_fax").focus();

				var img_uploader = angular.element('<div ui-uploader="{ url : \'upload.php?action=company&id=\'+company.company_ID+\'\', img:\'/img/company/200x100_\'+company.company_ID+\'.png\', allowedFileTypes : [\'png\'], width:200, height:100 }"></div><span class="help-block">(200px x 100px) [.png]</span></div><span class="help-block uploader-error"></span>');
				$compile(img_uploader)($scope,function(clonedElement, $scope) {
					$('#img-loader').html(clonedElement);
				});


				//$scope.company.user 	= objectFindByKey($scope.users, 	'user_ID', 		$scope.company.user_ID);
				//$scope.company.location = objectFindByKey($scope.locations, 'location_ID', 	$scope.company.location_ID);

				/*$scope.complete = {
					brand:{count:0, total:0},
					about:{count:0, total:0},
					user:{count:0, total:0},
					location:{count:0, total:0},
					categories:{count:0, total:0},
					tags:{count:0, total:0},
					total:{count:0, total:0},
				};
				var total = 0;
				if (data.company_ID)	++$scope.complete.total.count; ++$scope.complete.total.total;

				//if (data.company_img)	++$scope.complete.brand.count; ++$scope.complete.brand.total;
				//if (data.company_logo)	++$scope.complete.brand.count; ++$scope.complete.brand.total;
				//if (data.username) 		++$scope.complete.brand.count; ++$scope.complete.brand.total;
				if (data.company_name) 	++$scope.complete.brand.count; ++$scope.complete.brand.total;
				if (data.company_url) 	++$scope.complete.brand.count; ++$scope.complete.brand.total;

				if (data.company_phone) ++$scope.complete.about.count; ++$scope.complete.about.total;
				if (data.company_description) ++$scope.complete.about.count; ++$scope.complete.about.total;

				if (data.categories) 	++$scope.complete.categories.count; ++$scope.complete.categories.total;
				if (data.tags) 			++$scope.complete.tags.count; ++$scope.complete.tags.total;

				if (data.user_ID) 		++$scope.complete.user.count; ++$scope.complete.user.total;
				//if (data.user_img) 		++$scope.complete.user.count; ++$scope.complete.user.total;

				if (data.location_ID) 	++$scope.complete.location.count; ++$scope.complete.location.total;
				//if (data.location_img) 	++$scope.complete.location.count; ++$scope.complete.location.total;

				for (var key in $scope.complete) {
					if (key != 'total') {
						$scope.complete.total.count += $scope.complete[key].count;
						$scope.complete.total.total += $scope.complete[key].total;
					}
					$scope.complete[key].percent = ($scope.complete[key].count == $scope.complete[key].total) ? 0 : Math.ceil($scope.complete[key].count/$scope.complete[key].total*100);
				}
				console.log($scope.complete);*/
			}
		});

	$scope.saveCompany = function() {
		//$scope.company.tags = $('#tags').val();	// custom element
		if ($('#company_phone').val()) $scope.company.company_phone = $('#company_phone').val().replace(/[^0-9]/g, '');
		if ($('#company_fax').val()) $scope.company.company_fax = $('#company_fax').val().replace(/[^0-9]/g, '');


		var company = objectClone($scope.company);
		delete company.user;
		delete company.users;
		delete company.location;
		delete company.locations;
		console.log(company);
		$http.put('/company/edit', company)
			.success(function(data) {
				console.log(data);
				$scope.alerts = (data.alerts) ? $scope.alerts = data.alerts : [];
				$scope.errors = (data.errors) ? $scope.errors = data.errors : {};
				if (!data.alerts && !data.errors) {

					// update view tab
					$scope.company.user = $scope.users[$scope.company.user_ID];
					$scope.company.location = $scope.locations[$scope.company.location_ID];

					$rootScope.companies[company.company_ID] = company;
				}
			});
	};

	$scope.saveUser = function() {
		if ($('#user_cell').val()) $scope.user.user_cell = $('#user_cell').val().replace(/[^0-9]/g, '');
		if ($('#user_phone').val()) $scope.user.user_phone = $('#user_phone').val().replace(/[^0-9]/g, '');
		if ($('#user_fax').val()) $scope.user.user_fax = $('#user_fax').val().replace(/[^0-9]/g, '');

		$http.put('company/user', $scope.user)
			.success(function(data) {
				console.log(data);
				if (data.errors) {
					$scope.errors = data.errors;
				} else {
					$scope.errors = {};
					$scope.users[data] = $scope.user;
					$rootScope.users[data] = $scope.user;
				}
			});
	};

	$scope.saveLocation = function() {

		if ($('#location_phone').val()) $scope.location.location_phone = $('#location_phone').val().replace(/[^0-9]/g, '');
		if ($('#location_fax').val()) $scope.location.location_fax = $('#location_fax').val().replace(/[^0-9]/g, '');

		$http.put('company/location', $scope.user)
			.success(function(data) {
				console.log(data);
				$scope.errors = (data.errors) ? $scope.errors = data.errors : {};
				if (!data.alerts && !data.errors) {
					$scope.errors = {};
					$scope.locations[data] = $scope.location;
					$rootScope.locations[data] = $scope.location;
				}
			});
	};

}
CompanyEditPageCtrl.$inject = ['$scope', '$http', '$compile', '$routeParams'];

function CompanySearchPageCtrl($scope, $http, $routeParams) {
	$scope.companies = [];
	$scope.keyword = "";

	$scope.searchCompanies = function() {
		$http.get('/company/search/'+$scope.keyword)
			.success(function(data) {
				console.log(data);
				if (data.alerts) {
					$scope.alerts = data.alerts;
					$scope.companies = [];
				} else {
					$scope.alerts = [];
					$scope.companies = data;
				}
			});
	}
	$scope.searchCompanies();
}
CompanySearchPageCtrl.$inject = ['$scope', '$http', '$routeParams'];

function CompanyFollowPageCtrl($scope, $http) {
	$scope.following = [];
	$scope.followers = [];
	$scope.groups = [];
	$scope.keyword = "";

	$scope.follow = function(id, group_ID) {
		group_ID || (group_ID = '');

		if ($scope.following[id] == null) {	// add to array if not already there
			$scope.following[id] = $scope.followers[id];
		}

		if (group_ID == '') {}
		else {
			$scope.following[id].groups.push(group_ID);
			$scope.groups[group_ID].group_count++;
		}

		$http.get('/company/follow/'+id+'/'+$scope.following[id].groups.join(","));
	};

	$scope.unfollow = function(id, group_ID) {
		group_ID || (group_ID = '');

		if (group_ID == '') {
			delete $scope.following[id];
			$http.delete('/company/follow/'+id);
		} else {
			delete $scope.following[id].groups.splice($scope.following[id].groups.indexOf(group_ID),1);
			$scope.groups[group_ID].group_count--;
			$http.get('/company/follow/'+id+'/'+$scope.following[id].groups.join(","));
		}
	};

	$scope.loadFollowers = function() {
		$http.get('/company/followers/')
			.success(function(data) {
				console.log(data);
				for (var i in data) {
					data[i].following = (parseInt(data[i].following)) ? true : false;
					if(data[i].groups) data[i].groups = data[i].groups.split(",");
					if(data[i].groups && typeof(data[i].groups) != "array") data[i].groups = [data[i].groups];	// if single group
				}

				$scope.followers = data;
			});
	};
	$scope.loadFollowers();

	$scope.loadFollowing = function() {
		$http.get('/company/following/')
			.success(function(data) {
				console.log(data);
				for (var i in data) {
					data[i].following = true;
					if(data[i].groups) data[i].groups = data[i].groups.split(",");
					if(data[i].groups && typeof(data[i].groups) != "object") data[i].groups = [data[i].groups];	// if single group
				}
				$scope.following = data;
				console.log(data);
			});
	};
	$scope.loadFollowing();

	$scope.loadGroups = function() {
		$http.get('/company/group/')
			.success(function(data) {
				console.log(data);
				$scope.groups = data;
			});
	}
	$scope.loadGroups();

	$scope.addGroup = function() {
		$http.post('/company/group/', {group_name:$scope.group_name})
			.success(function(data) {
				console.log(data);
				$scope.groups[data] = {group_name:$scope.group_name, group_ID:data, group_count:0};
				$scope.group_name = "";
			});
	}
}
CompanyFollowPageCtrl.$inject = ['$scope', '$http'];
