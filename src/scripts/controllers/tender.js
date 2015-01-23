//** Tender **//
TenderCtrl.$inject = ['$scope', '$filter', '$http', '$routeParams'];
function TenderCtrl($scope, $filter, $http, $routeParams) {
	console.log('TenderCtrl ('+$scope.$id+')');
	
	$scope.errors = {};
	
	// date / time tools
	var now = +new Date();
	// timestamp -> strings for input fields
	$scope.dateFilterTo = function(timestamp) {
		var datetime = {};
		
		datetime.date = $filter('date')(timestamp, 'yyyy-mm-dd');//'dd MMM yyyy'); // requires passing jQuery i18n 
		datetime.time = $filter('date')(timestamp, 'hh:mm a');
		
		return datetime;
	};
	// strings for input fields -> timestamp
	$scope.dateFilterFrom = function(datetime) {
		var timestamp = +new Date(datetime.date+' '+datetime.time);
		return timestamp;
	};
	
	$scope.timezone = function(datetimepicker) {
		var timestamp = $scope.dateFilterFrom(datetimepicker);
		var date 		= new Date(timestamp);
		//date.timezone 	= date.obj.getTimezoneOffset()*60000;
		var m = new RegExp(/\((\w*)\)/).exec(date.toString());
		return (m === null) ? "" : m[1];
	};
	
	$scope.makeNewTender = function() {
		// master object
		$scope.tender = {
			tender_type		:"16",
			post_timestamp		:(now - now%86400000 + 86400000*2 + (9*60 + $rootScope.timezone_min)*60000),
			question_timestamp	:(now - now%86400000 + 86400000*7 + (17*60 + $rootScope.timezone_min)*60000),
			close_timestamp		:(now - now%86400000 + 86400000*14 + (17*60 + $rootScope.timezone_min)*60000),
			
			users			:[$scope.session.user_ID],
			privacy			:0,
			nda_ID			:"0",
			timestamp_create	:(now)
		};
		
		
		// buyer - forms
		$scope.datetimepicker = {
			post:$scope.dateFilterTo($scope.tender.post_timestamp),
			question:$scope.dateFilterTo($scope.tender.question_timestamp),
			close:$scope.dateFilterTo($scope.tender.close_timestamp)
		};
		
	}
	
	
	
	$scope.page_url = 'edit_details';
	$scope.stage = 0;
	$scope.progress = 0;	// progress of tender
	$scope.approval_required = [];	// list of companies to approve
	$scope.signatures = [];		// list of users who signed an nda
	$scope.bids = [];
	
	// supplier - forms
	$scope.bid = {
		tender_ID:$routeParams.tender_ID
	};
	
	//-- Functions --//
	// progress bar - hidden
	$scope.setStage = function(data) {
		// stages - control what is shown
		var now = +new Date();
		if (now < data.post_timestamp) {
			$scope.stage = 0;//"setup";
		} else if (now < data.question_timestamp) {
			$scope.stage = 1;//"question";
		} else if (now < data.close_timestamp) {
			$scope.stage = 2;//"bid";
		} else if (now > data.close_timestamp) {
			$scope.stage = 3;//"award";
		} else {
			$scope.stage = -1;//"create";
		}
		console.log(data);
		$scope.progress = {
			'create':5,
			'post':parseInt(5+95*(data.post_timestamp - data.timestamp_create)/(data.close_timestamp - data.timestamp_create)),
			'question':parseInt(5+95*(data.question_timestamp - data.timestamp_create)/(data.close_timestamp - data.timestamp_create)),
			'close':100,
			'current':parseInt(5+95*(now - data.timestamp_create)/(data.close_timestamp - data.timestamp_create))
		};
		console.log($scope.progress);
	};
	
	$scope.loadTender = function(tender_ID) {
		console.log('loadTender('+tender_ID+')');
		if (!tender_ID) return;
		$scope.tender = {};

		$http.get($scope.settings.server+'tender/'+tender_ID)
			.success(function(data) {
				console.log(data);
				//data.categories  = data.categories.split(",");

				data.post_timestamp 	*= 1000;
				data.question_timestamp *= 1000;
				data.close_timestamp 	*= 1000;
				data.timestamp_create 	*= 1000;
				data.timestamp_update 	*= 1000;
				
				$scope.datetimepicker = {
					post:$scope.dateFilterTo(data.post_timestamp),
					question:$scope.dateFilterTo(data.question_timestamp),
					close:$scope.dateFilterTo(data.close_timestamp)
				};
				
				data.tender_type = data.tender_type.toString(); // for select option
				data.nda_ID = data.nda_ID.toString(); // for select option
				
				$scope.tender  = data;
				$scope.setStage(data);
				
				
				// load files list
				//$rootScope.filepicker.view($rootScope.settings.filepicker.tender_multi_files, $scope.tender.tender_ID);
			})
			.error(function() {
				$rootScope.http_error();
			});
	};
	
	//-- Stage 0 - Setup Functions --//
	
	// Buyer
	$scope.updateTender = function() {
		console.log('updateTender()');
		//if ($('#tags').val()) $scope.tender.tags = $('#tags').val();	// custom element

		

		$scope.tender.post_timestamp 		= $scope.dateFilterFrom($scope.datetimepicker.post)/1000;
		$scope.tender.question_timestamp 	= $scope.dateFilterFrom($scope.datetimepicker.question)/1000;
		$scope.tender.close_timestamp 		= $scope.dateFilterFrom($scope.datetimepicker.close)/1000;
		//$scope.setStage($scope.tender);
		
		var tender = objectClone($scope.tender);
		delete tender.timestamp_create;
		delete tender.timestamp_update;
		
		// http request
		var http_config = {
            'method':'put', // get,head,post,put,delete,jsonp
            'url':$rootScope.settings.server+'/tender',
            'data':tender
        },
	    http_callback = function(data, status, headers, config) {
            if (data.tender_ID) {
				$scope.tender.tender_ID = data.tender_ID;
				$rootScope.alerts = [{'class':'success', 'label':'Tender:', 'message':'Saved'}];
			}
        };
        
        $http(http_config)
			.success(function(data, status, headers, config) {
				console.log('updateTender.put.success');
				if ($rootScope.checkHTTPReturn(data)) {
					http_callback(data, status, headers, config);
				} else {
					$scope.errors = (data.errors) ? data.errors : {};
				}
			})
			.error(function(data, status) {
			    console.log('updateTender.put.error');
				$rootScope.http_error();
				$rootScope.offline.que_request(http_config, http_callback);
			});

	};
	
	//-- Stage 1 - Question Functions --//
	// Buyer
	$scope.saveTenderAmendment = function() {
		$scope.amendment.tender_ID = $scope.tender.tender_ID;
		$scope.amendment.files = $scope.files.join(",");
		console.log($scope.amendment);
		$http.put($scope.settings.server+'tender/amendment', $scope.amendment)
			.success(function(data) {
				console.log(data);
				if (data.errors) $scope.errors = data.errors;
				if (data.alerts) $rootScope.alerts = data.alerts;
				if (!data.errors) {
					$scope.amendment.change_timestamp = (+new Date);
					$scope.amendments.push($scope.amendment);
					$scope.amendment = {};
					$scope.files = [];
				}
			})
			.error(function() {
				$rootScope.http_error();
			});
	};
	
	// Buyer
	$scope.loadApprovalRequired = function() {
		$http.get($scope.settings.server+'tender/approval_required/'+$scope.tender.tender_ID)
			.success(function(data) {
				console.log(data);
				$scope.approval_required = data;
			})
			.error(function() {
				$rootScope.http_error();
			});
	};
	$scope.approve_company = function(company_ID, approve) {
		$http.get($scope.settings.server+'tender/approve_company/'+$scope.tender.tender_ID+'/'+company_ID+'/'+approve)
			.success(function(data) {
				console.log(data);
				if (data.errors) $scope.errors = data.errors;
				if (data.alerts) $rootScope.alerts = data.alerts;
				if (!data.errors) {
					$scope.loadApprovalRequired();
				}
			})
			.error(function() {
				$rootScope.http_error();
			});
	};
	
	// Buyer
	$scope.loadSignatures = function() {
		$http.get($scope.settings.server+'tender/signature/'+$scope.tender.tender_ID)
			.success(function(data) {
				//console.log(data);
				$scope.signatures = data;

				//***** not working
				/*for (var i = 0, l = $scope.signatures.length; i < l; i++) {
					$('.sigPad['+i+']')
						.signaturePad({displayOnly:true})
						.regenerate(JSON.parse($scope.signatures[i].signature));
				}*/
			})
			.error(function() {
				$rootScope.http_error();
			});
	};
	
	//-- Stage 2 - Bid Functions --//
	
	//-- Stage 3 - Award Functions --//
	
	// Buyer
	$scope.loadBids = function() {
		$http.get($scope.settings.server+'tender/bid/'+$scope.tender.tender_ID)
			.success(function(data) {
				console.log(data);
				$scope.bids = data;
			})
			.error(function() {
				$rootScope.http_error();
			});
	};
	$scope.award_company = function(company_ID, award) {
		$http.get($scope.settings.server+'tender/award_company/'+$scope.tender.tender_ID+'/'+company_ID+'/'+award)
			.success(function(data) {
				console.log(data);
				if (data.errors) $scope.errors = data.errors;
				if (data.alerts) $rootScope.alerts = data.alerts;
				if (!data.errors) {
					$scope.loadBids();
				}
			})
			.error(function() {
				$rootScope.http_error();
			});
	};
	
	$rootScope.require_signin(function() {
		if ($routeParams.tender_ID) {
			$scope.loadTender($routeParams.tender_ID);
		} else {
			$scope.makeNewTender();
		}
	});
}

// ******************* OLD


QTenderCtrl.$inject = ['$scope', '$http', '$routeParams'];
function QTenderCtrl($scope, $http, $routeParams) {
	$scope.alerts = [];
	$scope.errors = {};

	$scope.tender = null;
	$scope.permission = {};
	$scope.bid = {tender_ID:$routeParams.tender_ID};

	$scope.$on('$viewContentLoaded', function(event) {
		$scope.tab_nav('details');
	});

	// tabs
	$scope.tab_nav = function(id) {
		var ids = ['details', 'questions', 'nda', 'bid'];
		// unset all
		for (var i = 0, l = ids.length; i < l; i++) {
			$('#tab_'+ids[i]).hide();
			$('#tab_nav_'+ids[i]).removeClass("active");
		}
		// set id
		$('#tab_'+id).show();
		$('#tab_nav_'+id).addClass("active");
	};

	$scope.follow = function(action) {
		$scope.permission.follow = action;
		if (action) $http.post('/tender/follow/'+$scope.tender.tender_ID);
		else 		$http.delete('/tender/follow/'+$scope.tender.tender_ID);
	};


	$scope.loadTender = function(tender_ID) {
		if (tender_ID == "0") {
			return;
		}
		$scope.tender = {};

		$http.get('/tender/view/'+tender_ID)
			.success(function(data) {
				console.log(data);
				data.categories  = data.categories.split(",");

				data.post_timestamp 	= parseInt(data.post_timestamp) 	+ $scope.date.timezone;	// add timezone
				data.question_timestamp = parseInt(data.question_timestamp) + $scope.date.timezone;	// add timezone
				data.close_timestamp 	= parseInt(data.close_timestamp) 	+ $scope.date.timezone;	// add timezone
				data.timestamp_update 	= parseInt(data.timestamp_update) 	+ $scope.date.timezone;	// add timezone

				$scope.tender  = data;

				// stages - control what is shown
				$scope.setStage(data);
				$scope.loadPermission(tender_ID);
			});
	};
	//$scope.loadTender($routeParams.tender_ID);

	$scope.loadPermission = function(tender_ID) {
		$http.get('/tender/permission/'+tender_ID)
			.success(function(data) {
				console.log(data);
				if (data.alerts) {
					$scope.alerts = data.alerts;
				} else {
					$scope.permission = data;
				}

				// signature
				$('.sigPad').signaturePad({
					defaultAction:'drawit',
					drawOnly:true
				});
			});
	};

	$scope.sign_nda = function() {
		$http.post('/tender/signature/'+$scope.tender.tender_ID, $('#signature').val())
			.success(function(data) {
				console.log(data);
				if (data.alerts) {
					$scope.alerts = data.alerts;
				} else {
					$scope.permission.signed = true;
					$scope.follow(true);				// add to follow list
				}
			});
	};

	$scope.request_approval = function() {
		$http.get('/tender/request_approval/'+$scope.tender.tender_ID)
			.success(function(data) {
				console.log(data);
				if (data.alerts) {
					$scope.alerts = data.alerts;
				} else {
					$scope.permission.waiting = true;
					$scope.follow(true);				// add to follow list
				}
			});

	};

	$scope.download = function() {


	};

	$scope.saveBid = function() {
		$http.put('/tender/bid', $scope.bid).success(function(data) {
			console.log(data);
			if (data.errors) $scope.errors = data.errors;
			if (data.alerts) $rootScope.alerts = data.alerts;
			if (!data.errors) {
				$scope.permission.bid = true;
				$scope.follow(true);				// add to follow list
			}
		});

	};



	$scope.emailModal = function(email) {
		$scope.email = email;
		$('#emailModal').modal('show');
	};
	$scope.phoneModal = function(phone) {
		$scope.phone = phone;
		$('#phoneModal').modal('show');
	};
}

function TenderEditPageCtrl($scope, $http, $compile, $routeParams) {
	$scope.errors = {};
	$scope.alerts = [];

	$scope.tender = {};				// tender data
	$scope.amendment = {};
	$scope.amendments = [];

	$scope.stage = 0;				// tenders life stage
	$scope.signatures = [];		// list of users who signed an nda
	$scope.approval_required = [];	// list of companies to approve
	$scope.bids = [];				// list of bids

	$scope.files = [];	// array of file IDs from upload

	$scope.upload = {
		folder:'',
		successActionRedirect:'alert()'
	};


	$scope.reload = function() {
		var img_uploader = angular.element('<div ui-uploader="{ url : \'upload.php?action=tender&id=\'+tender.tender_ID+\'\', img:\'/img/tender/\'+tender.tender_ID+\'.png\', allowedFileTypes : [\'png\'], width:200, height:200 }"></div><span class="help-block">(200px x 200px) [.png]</span></div><span class="help-block uploader-error"></span>');
		$compile(img_uploader)($scope,function(clonedElement, $scope) {
			$('#img-loader').html(clonedElement);
		});

		var file_uploader = angular.element('<div ui-uploader-multi="{ url : \'upload.php?action=tender_files&id=\'+tender.tender_ID+\'\',  allowedFileTypes : [\'png\',\'pdf\',\'zip\',\'doc\'] }"></div><span class="help-block">[.pdf, .zip, .doc]</span></div><span class="help-block uploader-error"></span>');
		$compile(file_uploader)($scope,function(clonedElement, $scope) {
			$('#tender-file-loader').html(clonedElement);
			$('#change-file-loader').html(clonedElement);
		});
	};

	$scope.$on('$includeContentLoaded', function(event) { $scope.reload(); });
	$scope.$on('$viewContentLoaded', function(event) { $scope.reload(); });

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
	   'minChars' : 3,
	   'maxChars' : 0, //if not provided there is no limit,
	   'placeholderColor' : '#666666'
	});*/

	/*$scope.post_date = {};
	$scope.question_date = {};
	$scope.close_date = {};
	//$scope.award_date = {};

	$scope.dateselectChange = function(id) {
		console.log("dateselectChange");
		console.log($scope.tender[id+'_date']);
		var date = new Date(parseInt($scope.tender[id+'_date']));
		console.log(date);
		$scope.tender[id+'_date'] = +new Date(
			$scope[id+'_date'].year,
			parseInt($scope[id+'_date'].month)-1,
			$scope[id+'_date'].day,
			$scope[id+'_date'].hour,
			$scope[id+'_date'].min
		);
		console.log($scope.tender[id+'_date']);
		var date = new Date(parseInt($scope.tender[id+'_date']));
		console.log(date);
	}
	$scope.datepickerChange = function(id) {
		console.log("datepickerChange");
		console.log($scope.tender[id+'_date']);
		var date = new Date(parseInt($scope.tender[id+'_date']));
		console.log(date);
		$scope[id+'_date'].year = date.getFullYear().toString();
		$scope[id+'_date'].month = numberPadding(date.getMonth()+1, 2);
		$scope[id+'_date'].day = numberPadding(date.getDate(), 2);

		$scope[id+'_date'].hour = numberPadding(date.getHours(), 2);
		$scope[id+'_date'].min = numberPadding(date.getMinutes(), 2);
	}
	$scope.datepickerOpen = function(id) {
		console.log("datepickerOpen");
		$('#post_date_picker').datepicker('show').on('changeDate', function(ev) {
			console.log("datepickerCB");
			console.log(ev.date.valueOf());
			$scope.tender[id+'_date'] = ev.date.valueOf();
			$('#post_date').val(ev.date.valueOf());
			console.log($scope.tender.post_date);
			$scope.datepickerChange(id);

		});
	}*/

	//$('#post_date').datepicker();
	//$('#question_date').datepicker();
	//$('#close_date').datepicker();
	//$('#award_date').datepicker();

	$scope.loadApprovalRequired = function() {
		$http.get('/tender/approval_required/'+$scope.tender.tender_ID)
			.success(function(data) {
				console.log(data);
				$scope.approval_required = data;
			});
	};

	$scope.loadSignatures = function() {
		$http.get('/tender/signature/'+$scope.tender.tender_ID)
			.success(function(data) {
				//console.log(data);
				$scope.signatures = data;

				//***** not working
				/*for (var i = 0, l = $scope.signatures.length; i < l; i++) {
					$('.sigPad['+i+']')
						.signaturePad({displayOnly:true})
						.regenerate(JSON.parse($scope.signatures[i].signature));
				}*/
			});
	};

	$scope.loadBids = function() {
		$http.get('/tender/bid/'+$scope.tender.tender_ID)
			.success(function(data) {
				console.log(data);
				$scope.bids = data;
			});
	};

	$scope.loadTender = function(tender_ID) {
		if (tender_ID == "0") {
			$scope.tender.tender_ID = 0;
			$scope.tender.tender_type = "1";

			$scope.tender.post_date = (+new Date()) + 86400000*2;
			$scope.tender.post_time = numberPadding(9*60, 4);
			//$scope.datepickerChange('post');
			$scope.tender.question_date = (+new Date()) + 86400000*7;
			$scope.tender.question_time = numberPadding(17*60, 4);
			$scope.tender.close_date = (+new Date()) +  + 86400000*14;
			$scope.tender.close_time = numberPadding(17*60, 4);
			//$scope.tender.award_date = $scope.date.unix;
			$scope.tender.users = [];
			$scope.tender.users.push($scope.session.user_ID);

			$scope.tender.privacy = 0;
			$scope.tender.nda_ID = "0";

			return;
		}

		$http.get('/tender/edit/'+tender_ID).success(function(data) {
			console.log(data);
			//$('#tags').importTags(data.tags);	// custom elements

			var post = $scope.unix2date(data.post_timestamp);
			var question = $scope.unix2date(data.question_timestamp);
			var close = $scope.unix2date(data.close_timestamp);

			data.post_date = post.time_day;
			data.post_time = numberPadding(post.day_min, 4);
			data.post_timestamp = post.time;

			data.question_date = question.time_day;
			data.question_time = numberPadding(question.day_min, 4);
			data.question_timestamp = question.time;

			data.close_date = close.time_day;
			data.close_time = numberPadding(close.day_min, 4);
			data.close_timestamp = close.time;

			$scope.tender  = data;

			console.log(JSON.stringify($scope.tender));
			// stages - control what is shown
			var now = +new Date;
			if (now < $scope.tender.post_timestamp) {
				$scope.stage = 0;//"setup";
			} else if (now < $scope.tender.question_timestamp) {
				$scope.stage = 1;//"question";
			} else if (now < $scope.tender.close_timestamp) {
				$scope.stage = 2;//"bid";
			} else {
				$scope.stage = 3;//"award";
			}
			console.log("Stage: "+$scope.stage+" @now = "+now);

			$scope.$watch('stage', function() {
				$scope.reload();
			});


			if ($scope.stage > 0) {
				$scope.loadApprovalRequired();
				$scope.loadSignatures();
				$scope.loadBids();
			}
		});
	};
	$scope.loadTender($routeParams.tender_ID);

	$scope.saveTender = function() {
		//if ($('#tags').val()) $scope.tender.tags = $('#tags').val();	// custom element

		var tender = objectClone($scope.tender);

		tender.post_timestamp 		= $scope.date2unix(tender.post_timestamp, 		$('#post_date').val(), 		parseFloat(tender.post_time));
		tender.question_timestamp 	= $scope.date2unix(tender.question_timestamp, 	$('#question_date').val(), 	parseFloat(tender.question_time));
		tender.close_timestamp 		= $scope.date2unix(tender.close_timestamp, 		$('#close_date').val(), 		parseFloat(tender.close_time));

		console.log(JSON.stringify(tender));

		$http.put('/tender/edit', tender).success(function(data) {
			console.log(data);
			if (data.errors) $scope.errors = data.errors;
			if (data.alerts) $rootScope.alerts = data.alerts;
			if (data.tender_ID) {
				//window.location.href="#/tender/edit/"+data;
				if ($scope.tender.tender_ID == 0) {
					$scope.tender.tender_ID = parseInt(data.tender_ID);
					$scope.reload();
				}
			}
		});
	}

	$scope.saveTenderAmendment = function() {
		$scope.amendment.tender_ID = $scope.tender.tender_ID;
		$scope.amendment.files = $scope.files.join(",");
		console.log($scope.amendment);
		$http.put('/tender/amendment', $scope.amendment)
			.success(function(data) {
				console.log(data);
				if (data.errors) $scope.errors = data.errors;
				if (data.alerts) $rootScope.alerts = data.alerts;
				if (!data.errors) {
					$scope.amendment.change_timestamp = (+new Date);
					$scope.amendments.push($scope.amendment);
					$scope.amendment = {};
					$scope.files = [];
				}
			});
	}

	$scope.approve_company = function(company_ID, approve) {
		$http.get('/tender/approve_company/'+$scope.tender.tender_ID+'/'+company_ID+'/'+approve)
			.success(function(data) {
				console.log(data);
				if (data.errors) $scope.errors = data.errors;
				if (data.alerts) $rootScope.alerts = data.alerts;
				if (!data.errors) {
					$scope.loadApprovalRequired();
				}
			});
	}

	$scope.award_company = function(company_ID, award) {
		$http.get('/tender/award_company/'+$scope.tender.tender_ID+'/'+company_ID+'/'+award)
			.success(function(data) {
				console.log(data);
				if (data.errors) $scope.errors = data.errors;
				if (data.alerts) $rootScope.alerts = data.alerts;
				if (!data.errors) {
					$scope.loadBids();
				}
			});
	}

	// invite to bid
	$scope.invites = {};
	$scope.keyword = "";
	$scope.companies = [];
	$scope.searchCompanies = function(page) {
		page || (page = 0);
		$http.post('/company/search/'+page, {keyword:$scope.keyword, order_by:'page_rank DESC', per_page:8})
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
}
TenderEditPageCtrl.$inject = ['$scope', '$http', '$compile', '$routeParams'];
