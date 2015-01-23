<?php


//require_once 'aws/sdk.class.php';
//require_once 'class.aws.s3.php';

class Tender extends Core {
	private $table = 'tenders';

	function __construct() {
		parent::__construct();
    }

	function __destruct() {
		parent::__destruct();
  	}

  	function aws_upload($bucket=NULL) {
  		//trim(file_get_contents('1'));
  		//$s3_uploader = new S3BrowserUpload();
  		$s3 = new S3(AWS_KEY, AWS_SECRET_KEY);
  		if (!$s3->isBucket($bucket)) {
	  		$s3->createBucket($bucket, array(
	  			'content-md5' => ""
	  			."<CORSConfiguration>\n"
				  ."<CORSRule>\n"
				    ."<AllowedOrigin>https://rfqs.ca</AllowedOrigin>\n"

				    ."<AllowedMethod>GET</AllowedMethod>\n"
				    ."<AllowedMethod>PUT</AllowedMethod>\n"
				    ."<AllowedMethod>POST</AllowedMethod>\n"
				    ."<AllowedMethod>DELETE</AllowedMethod>\n"

				    ."<MaxAgeSeconds>3000</MaxAgeSeconds>\n"

				  ."</CORSRule>\n"
				."</CORSConfiguration>")
	  		);
  		}


	  	return AWS_KEY;
  	}

	function post_search($page=0, $request_data=NULL) {
		$return = array();

		$params = array(
			//"search_ID",
			"company_ID",
			"type",
			"keyword",
			"categories",
			"order_by",
			"per_page"
		);

		foreach ($params as $key) {
			$request_data[$key] = isset($request_data[$key]) ? $request_data[$key] : NULL;
		}

		$request_data['company_ID'] = COMPANY_ID;

		if ($request_data['order_by'] == NULL) $request_data['order_by'] = 'close_timestamp DESC';
		if ($request_data['per_page'] == NULL) $request_data['per_page'] = 20;
		
		// Check permissions
		if(!$this->permission->check($request_data)) {
			return $this->permission->errorMessage();
		};
		
		// query
		$query = "SELECT tender_ID, title, close_timestamp FROM tenders T"
				." WHERE company_ID != '{{company_ID}}'"
				." AND (title LIKE '%{{keyword}}%' OR details LIKE '%{{keyword}}%' OR tags LIKE '%{{keyword}}%')"
				." ORDER BY ".$request_data['order_by']." LIMIT $page,".(($page+1)*$request_data['per_page']);

		// results
		$results = $this->db->query($query, array(
			'keyword' 		=> $request_data['keyword'],
			'company_ID' 	=> $request_data['company_ID']
		));
		if ($results) {
			while($tender = $this->db->fetch_assoc($results)) {
				$return[] = $tender;
			}
		}

		return $return;
	}

	/*
	Get all tenders related to a company (used by widget)
	*/
	function company($company_ID=NULL) {
		$return = array();

		if (is_null($company_ID)) $company_ID = COMPANY_ID;
		
		// Check permissions
		if(!$this->permission->check(array("company_ID" => $company_ID))) {
			return $this->permission->errorMessage();
		};
		
		// validate and sanitize
		$this->filter->set_request_data('company_ID', $company_ID);
		$this->filter->set_group_rules('companies');
		$this->filter->set_key_rules(array('company_ID'), 'required');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$company_ID = $this->filter->get_request_data('company_ID');

		// if hash passed instead
		$db_where = array('company_hash' => $company_ID);
		$results = $this->db->select('companies', $db_where);
		if ($results) {
			$company = $this->db->fetch_assoc($results);
			$company_ID =	$company['company_ID'];
		}

		// company ID
		$db_where = array('company_ID' => $company_ID);
		$results = $this->db->select('tenders', $db_where);
		if ($results) {
			while($tender = $this->db->fetch_assoc($results)) {
				$return[] = $tender;
			}
		}

		return $return;
	}

	/*
	list of tenders being followed
	*/
	function get_follow() {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check()) {
			return $this->permission->errorMessage();
		};
		
		// validate and sanitize
		/*$this->filter->set_request_data('tender_ID', $tender_ID);
		$this->filter->set_group_rules('tenders');
		$this->filter->set_key_rules(array('tender_ID'), 'required');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$tender_ID = $this->filter->get_request_data('tender_ID');*/

		$query = "SELECT * FROM follow_tender FT"
				." LEFT JOIN tenders T ON T.tender_ID = FT.tender_ID"
				." WHERE FT.company_ID = '{{company_ID}}'";
		$results = $this->db->query($query, array(
			'company_ID' => COMPANY_ID,
		));
		if ($results) {
			while ($tender = $this->db->fetch_assoc($results)) {
				$return[] = $tender;
			}
		}

		return $return;
	}

	/*
	Follow a tender
	*/
	function post_follow($tender_ID=NULL) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check(array("tender_ID" => $tender_ID))) {
			return $this->permission->errorMessage();
		};
		
		// validate and sanitize
		$this->filter->set_request_data('tender_ID', $tender_ID);
		$this->filter->set_group_rules('tenders');
		$this->filter->set_key_rules(array('tender_ID'), 'required');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$tender_ID = $this->filter->get_request_data('tender_ID');

		$this->db->insert('follow_tender', array(
			'user_ID' => USER_ID,
			'company_ID' => COMPANY_ID,
			'tender_ID' => $tender_ID,
			'timestamp' => $_SERVER['REQUEST_TIME']
		));

		return;
	}

	function delete_follow($tender_ID=NULL) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check(array("tender_ID" => $tender_ID))) {
			return $this->permission->errorMessage();
		};
		
		// validate and sanitize
		$this->filter->set_request_data('tender_ID', $tender_ID);
		$this->filter->set_group_rules('tenders');
		$this->filter->set_key_rules(array('tender_ID'), 'required');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$tender_ID = $this->filter->get_request_data('tender_ID');
		$company_ID = COMPANY_ID;

		$this->db->delete('follow_tender', array(
			'company_ID' => COMPANY_ID,
			'tender_ID' => $tender_ID
		));

		return;
	}

	//-- Bid Stages --//
	// get current permissions and bid stage for a tender
	function permission($tender_ID=NULL) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check(array("tender_ID" => $tender_ID))) {
			return $this->permission->errorMessage();
		};
		
		// validate and sanitize
		$this->filter->set_request_data('tender_ID', $tender_ID);
		$this->filter->set_group_rules('tenders');
		$this->filter->set_key_rules(array('tender_ID'), 'required');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$tender_ID = $this->filter->get_request_data('tender_ID');
		$user_ID = USER_ID;
		$company_ID = COMPANY_ID;



		// Following
		$result = $this->db->select('follow_tender', array(
			'company_ID' => $company_ID,
			'tender_ID' => $tender_ID));
		if ($result) {
			$return['follow'] = true;
		}

		// Step 1 - Sign NDA
		// get nda ID
		$result = $this->db->select('tenders', array('tender_ID' => $tender_ID), array('privacy', 'nda_ID'));
		if ($result) {
			$tender = $this->db->fetch_assoc($result);

			// nda
			$result = $this->db->select('tender_nda_signature', array('user_ID' => $user_ID, 'tender_ID' => $tender_ID, 'nda_ID' => $tender['nda_ID']));
			if ($result) {
				$return['signed'] = true;
			}
		}

		// Step 2 - Request Approval
		$result = $this->db->select('tender_company', array('company_ID' => $company_ID, 'tender_ID' => $tender_ID));
		if ($result) {
			$company = $this->db->fetch_assoc($result);
			if ($tender['privacy'] == 0) {			// public
				$return['approved'] = true;
			} else if ($tender['privacy'] == 1) {	// public with approval
				if ($company['approved_timestamp'] > $company['request_timestamp']) $return['approved'] = true;
				else if ($company['approved_timestamp'] == 0) $return['denied'] = true;
				else $return['waiting'] = true;
			} else if ($tender['privacy'] == 2) {	// private - invites
				$return['approved'] = true;
			}
		}

		// Setp 3 - Place Bid
		$result = $this->db->select('bids', array('company_ID' => $company_ID, 'tender_ID' => $tender_ID));
		if ($result) {
			$return['bid'] = true;
		}

		return $return;
	}


	

	//-- Approval --//
	/*
	Send request to bid on tender
	*/
	function request_approval($tender_ID=NULL) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check(array("tender_ID" => $tender_ID))) {
			return $this->permission->errorMessage();
		};
		
		// validate and sanitize
		$this->filter->set_request_data('tender_ID', $tender_ID);
		$this->filter->set_group_rules('tenders');
		$this->filter->set_key_rules(array('tender_ID'), 'required');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$tender_ID = $this->filter->get_request_data('tender_ID');

		$company_ID = COMPANY_ID;
		$user_ID = USER_ID;

		$this->db->insert('tender_company',
			array(
				'tender_ID' => $tender_ID,
				'company_ID' => $company_ID,
				'user_ID' => $user_ID,
				'request_timestamp' => $_SERVER["REQUEST_TIME"]
			)
		);

		return;
	}
	//-- End Approval --//

	//-- Bid --//
	function get_bid($tender_ID=NULL, $company_ID=NULL) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check(array("tender_ID" => $tender_ID, "company_ID" => $company_ID))) {
			return $this->permission->errorMessage();
		};
		
		// validate and sanitize
		$this->filter->set_request_data('tender_ID', $tender_ID);
		$this->filter->set_request_data('company_ID', $company_ID);
		$this->filter->set_group_rules('tenders, companies');
		$this->filter->set_key_rules(array('tender_ID'), 'required');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$tender_ID = $this->filter->get_request_data('tender_ID');
		$company_ID = $this->filter->get_request_data('company_ID');

		$query = "SELECT B.value, B.details, B.file_name, B.awarded, B.timestamp_create, B.timestamp_update, C.company_ID, company_name, U.user_ID, user_name, user_function"
				." FROM bids B"
				." LEFT JOIN companies C ON C.company_ID = B.company_ID"
				." LEFT JOIN users U ON U.user_ID = B.user_ID"
				." WHERE tender_ID = '{{tender_ID}}'";
		if ($company_ID) $query .= " AND B.company_ID = '{{company_ID}}'";

		$results = $this->db->query($query, array('tender_ID' => $tender_ID, 'company_ID' => $company_ID));
		if ($results) {
			while($result = $this->db->fetch_assoc($results)) {
				$return[] = $result;
			}
		}

		return $return;
	}

	function put_bid($request_data=NULL) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check($request_data)) {
			return $this->permission->errorMessage();
		};
		
		// validate and sanitize
		$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('table_bids');
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors();
			return $return;
		}
		$request_data = $this->filter->get_request_data();

		$set['tender_ID'] 			= $request_data['tender_ID'];
		$set['company_ID'] 			= COMPANY_ID;
		$set['user_ID'] 			= USER_ID;
		$set['value'] 				= $request_data['value'];
		$set['details'] 			= $request_data['details'];
		$set['timestamp_update'] 	= $_SERVER['REQUEST_TIME'];

		$update = $set;
		$set['timestamp_create'] = $_SERVER['REQUEST_TIME'];

		$this->db->insert_update('bids', $set, $update);

		$return["errors"] = array();
		$return["alerts"][] = array("class" => "success",	"label" => "Bid Submitted!");
		return $return;
	}
	//-- End Bid --//
	//-- End Bid Stages --//

	

	//-- EDIT PAGE --//
	/*
	list of companies that requested approval to bid
	*/
	function approval_required($tender_ID=NULL) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check(array("tender_ID" => $tender_ID))) {
			return $this->permission->errorMessage();
		};
		
		// validate and sanitize
		$this->filter->set_request_data('tender_ID', $tender_ID);
		$this->filter->set_group_rules('tenders');
		$this->filter->set_key_rules(array('tender_ID'), 'required');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$tender_ID = $this->filter->get_request_data('tender_ID');

		$query = "SELECT request_timestamp, approved_timestamp, C.company_ID, company_name, U.user_ID, user_name, user_function"
				." FROM tender_company TC"
				." LEFT JOIN companies C ON C.company_ID = TC.company_ID"
				." LEFT JOIN users U ON U.user_ID = TC.user_ID"
				." WHERE tender_ID = '{{tender_ID}}'";
		$results = $this->db->query($query, array('tender_ID' => $tender_ID));
		if ($results) {
			while($result = $this->db->fetch_assoc($results)) {
				$return[] = $result;
			}
		}

		return $return;
	}

	/*
	approve or deny a company that requested to bid on a tender
	*/
	function approve_company($tender_ID=NULL, $company_ID=NULL, $approve=true) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check(array("tender_ID" => $tender_ID, "company_ID" => $company_ID))) {
			return $this->permission->errorMessage();
		};
		
		// validate and sanitize
		$this->filter->set_request_data('tender_ID', $tender_ID);
		$this->filter->set_request_data('company_ID', $company_ID);
		$this->filter->set_request_data('approve', $approve);
		$this->filter->set_group_rules('approve_company');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$tender_ID = $this->filter->get_request_data('tender_ID');
		$company_ID = $this->filter->get_request_data('company_ID');
		$approve = $this->filter->get_request_data('approve');

		$approve_timestamp = ($approve) ? $_SERVER['REQUEST_TIME']: 0;

		$this->db->update('tender_company',
			array('approved_timestamp' => $approve_timestamp),
			array('tender_ID' => $tender_ID, 'company_ID' => $company_ID)
		);

		return;
	}

	/*
	award or reject a company that requested to bid on a tender
	*/
	function award_company($tender_ID=NULL, $company_ID=NULL, $approve=true) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check(array("tender_ID" => $tender_ID, "company_ID" => $company_ID))) {
			return $this->permission->errorMessage();
		};
		
		// validate and sanitize
		$this->filter->set_request_data('tender_ID', $tender_ID);
		$this->filter->set_request_data('company_ID', $company_ID);
		$this->filter->set_request_data('approve', $approve);
		$this->filter->set_group_rules('approve_company');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$tender_ID = $this->filter->get_request_data('tender_ID');
		$company_ID = $this->filter->get_request_data('company_ID');
		$approve = $this->filter->get_request_data('approve');

		$approve_timestamp = ($approve) ? $_SERVER['REQUEST_TIME']: 0;

		$this->db->update('bids',
			array('awarded' => $approve),
			array('tender_ID' => $tender_ID, 'company_ID' => $company_ID)
		);
		if ($approve) $return["alerts"][] = array("class" => "success",	"label" => "Tender awarded!");
		else $return["alerts"][] = array("class" => "warning",	"label" => "Tender UNawarded!");
		return $return;
	}

	/*
	get a tender detials
	session company only (privacy)
	*/
	/*function get_edit($tender_ID=NULL) {
		$return = array();

		// validate and sanitize
		$this->filter->set_request_data('tender_ID', $tender_ID);
		$this->filter->set_group_rules('tenders');
		$this->filter->set_key_rules(array('tender_ID'), 'required');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$tender_ID = $this->filter->get_request_data('tender_ID');

		$result = $this->db->select('tenders', array('tender_ID' => $tender_ID));
		if ($result) {
			$tender = $this->db->fetch_assoc($result);

			$tender['categories'] = explode(",", $tender['categories']);
			$tender['users'] 	= explode(",", $tender['users']);
			$return = $tender;
		}

		return $return;
	}*/
	
	/*
	get a tender detials
	session company only (privacy)
	*/
	function get($tender_ID=NULL) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check(array("tender_ID" => $tender_ID))) {
			return $this->permission->errorMessage();
		};
		
		// validate and sanitize
		$this->filter->set_request_data('tender_ID', $tender_ID);
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors();
			return $return;
		}
		$tender_ID = $this->filter->get_request_data('tender_ID');
		$company_ID = COMPANY_ID;

		$results = $this->db->select('tenders', array('tender_ID' => $tender_ID));
		if ($results) {
			$tender = $this->db->fetch_assoc($results);

			// allowed to view tender
			$invited_companies = explode(",", $tender['invited_companies']);
			if ($tender['privacy'] == 2 && !in_array($company_ID, $invited_companies)) {
				$return["alerts"][] = array("class" => "error",	"message" => "You do not have permission to view this tender.");
				return $return;
			}

			$return = $tender;

			// get company info
			$company = $this->db->select('companies', array('company_ID' => $tender['company_ID']));
			if ($company) {
				$company = $this->db->fetch_assoc($company);
				$return['company']['company_ID'] = $company['company_ID'];
				$return['company']['company_name'] = $company['company_name'];
			}

			// get users
			$query = "SELECT user_ID, user_name, user_name_first, user_name_last, user_function, user_phone FROM users"
					." WHERE user_ID IN ("
						."SELECT user_ID FROM tender_user WHERE tender_ID = '$tender_ID'"
					.")";
			//echo $query;
			$users = $this->db->query($query);
			if ($users) {
				$return['users'] = array();
				while($user = $this->db->fetch_assoc($users)) {
					$return['users'][] = $user;
				}
			}

			// get nda
			$ndas = $this->db->select('ndas', array('nda_ID' => $return['nda_ID']));
			if ($ndas) {
				$nda = $this->db->fetch_assoc($ndas);
				$return['nda'] = $nda;
			}
		}

		return $return;
	}
	
	

	function put_amendment($request_data = NULL) {
		$return = array();
		$params = array(
			"tender_ID",
			"change_name",
			"change_details",
			"files",
			"change_timestamp",
		);

		foreach ($params as $key) {
			$request_data[$key] = isset($request_data[$key]) ? $request_data[$key] : NULL;
		}
		
		// Check permissions
		if(!$this->permission->check($request_data)) {
			return $this->permission->errorMessage();
		};
		
		// validate and sanitize
		$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('tender_change');
		$this->filter->set_key_rules(array('tender_ID', 'change_name'), 'required');
		$this->filter->set_all_rules('trim|sanitize_string', true);
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors();
			return $return;
		}
		$request_data = $this->filter->get_request_data();

		// company //
		$change = array();
		foreach ($params as $key) {
			if (isset($request_data[$key])) $change[$key] = $request_data[$key];
		}
		$change["change_timestamp"] = $_SERVER['REQUEST_TIME'];
		$this->db->insert_update('tender_changes', $change);

		$return["alerts"][] = array("class" => "success",	"label" => "Tender Information Saved!");
		return $return;
	}
	
	/*
	replace company detials
	session company only (privacy)
	*/
	function put($request_data=NULL) {
		$return = array();
		$params = array(
			"tender_ID",
			"company_ID",
			"title",
			"ref_ID",
			"tender_type",
			"url",
			"details",

			//"categories",
			//"tags",

			"location_ID",
			"post_timestamp",
			"question_timestamp",
			"close_timestamp",


			// privacy
			"nda_ID",
			"privacy",
			"users",

			// invite
			//"group_ID",


		);

		foreach ($params as $key) {
			$request_data[$key] = isset($request_data[$key]) ? $request_data[$key] : NULL;
		}
		
		// Check permissions
		if(!$this->permission->check($request_data)) {
			return $this->permission->errorMessage();
		};
		
		//$categories = $request_data["categories"];
		$users = $request_data["users"];

		//$request_data["categories"] =  is_array($request_data["categories"]) ? implode(",", $request_data["categories"]) : $request_data["categories"];
		//$request_data["users"] = is_array($request_data["users"]) ? implode(",", $request_data["users"]) : $request_data["users"];

		// validate and sanitize
		$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('table_tenders');
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors();
			return $return;
		}
		$request_data = $this->filter->get_request_data();

		// tender //
		$tender = array(
			"tender_ID" 	=> $request_data["tender_ID"],
			"company_ID" 	=> COMPANY_ID,
			"title" 		=> $request_data["title"],
			"ref_ID" 		=> $request_data["ref_ID"],
			"tender_type" 	=> $request_data["tender_type"],
			"url" 			=> $request_data["url"],
			"details" 		=> $request_data["details"],

			//"categories",
			//"tags",

			"location_ID" 	=> $request_data["location_ID"],
			"post_timestamp" => $request_data["post_timestamp"],
			"question_timestamp" => $request_data["question_timestamp"],
			"close_timestamp" => $request_data["close_timestamp"],


			// privacy
			"nda_ID" 		=> $request_data["nda_ID"],
			"privacy" 		=> $request_data["privacy"],
			//"users" 		=> $request_data["users"],

			"timestamp_update" => $_SERVER['REQUEST_TIME']
		);
		

		if (!$request_data["tender_ID"]) {
			$tender["timestamp_create"] = $_SERVER['REQUEST_TIME'];
			//$tender["tender_hash"]		= sha1($request_data["tender_ID"].$_SERVER['REQUEST_TIME']);
		}

		$tender_ID = $this->db->insert_update($this->table, $tender);

		// save tender_users
		$this->db->delete('tender_user', array('tender_ID' => $tender_ID));
		if (is_array($users)) {
			foreach($users as $user_ID) {
				$this->db->insert('tender_user', array('tender_ID' => $tender_ID, 'user_ID' => $user_ID));
			}
		}

		// save tender_category
		/*$this->db->delete('tender_category', array('tender_ID' => $tender_ID));
		if (is_array($categories)) {
			foreach($categories as $category_ID) {
				$this->db->insert('tender_category', array('tender_ID' => $tender_ID, 'category_ID' => $category_ID));
			}
		}*/

		return array("tender_ID" => $tender_ID);
	}
	
	/*
	delete a tender
	*/
	/*function delete($tender_ID=NULL) {


	}*/


}

?>