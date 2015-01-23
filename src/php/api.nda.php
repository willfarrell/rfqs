<?php

// Class Template



class NDA extends Core {

	function __construct() {
		parent::__construct();
		
	}

	function __destruct() {
		
		parent::__destruct();
	}
	
	//-- NDA Signatures --//
	/*
	list of users that signed an nda
	*/
	function get_signature($tender_ID=NULL) {
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

		$query = "SELECT signature, signature_ip, signature_timestamp, C.company_ID, company_name, U.user_ID, user_name, user_function"
				." FROM tender_nda_signature TNS"
				." LEFT JOIN companies C ON C.company_ID = TNS.company_ID"
				." LEFT JOIN users U ON U.user_ID = TNS.user_ID"
				." WHERE tender_ID = '{{tender_ID}}'";
		$results = $this->db->query($query, array('tender_ID' => $tender_ID));
		if ($results) {
			while($result = mysql_fetch_assoc($results)) {
				$return[] = $result;
			}
		}

		return $return;
	}

	/*
	sign NDA for a tender
	*/
	function post_signature($tender_ID=NULL, $request_data=NULL) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check(array("tender_ID" => $tender_ID))) {
			return $this->permission->errorMessage();
		};
		
		$signature = filter_var(json_encode($request_data), FILTER_UNSAFE_RAW);

		// validate and sanitize
		$this->filter->set_request_data('tender_ID', $tender_ID);
		$this->filter->set_group_rules('tenders');
		$this->filter->set_key_rules(array('tender_ID'), 'required');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$tender_ID = $this->filter->get_request_data('tender_ID');

		$company_ID = $this->session->cookie["company_ID"];
		$user_ID = $this->session->cookie["user_ID"];

		$result = $this->db->select('tenders', array('tender_ID' => $tender_ID), array('nda_ID'));
		if ($result) {
			$tender = mysql_fetch_assoc($result);
			$this->db->insert('tender_nda_signature',
				array(
					'tender_ID' => $tender_ID,
					'nda_ID' => $tender['nda_ID'],
					'company_ID' => $company_ID,
					'user_ID' => $user_ID,
					'signature' => $signature,
					'signature_hash' => sha1($signature),
					'signature_ip' => $_SERVER['REMOTE_ADDR'],
					'signature_timestamp' => $_SERVER["REQUEST_TIME"]
				)
			);
		}

		return;
	}
	//-- End NDA Signatures --//
	
	
	function post() {
		
	}
	
	/*
	get a list of ndas for a company
	session company only (privacy)
	*/
	function get($nda_ID=NULL) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check(array("nda_ID" => $nda_ID))) {
			return $this->permission->errorMessage();
		};
		
		$db_where = array();
		if (is_null($nda_ID) || $nda_ID == 0) {
			$db_where['company_ID'] = COMPANY_ID;
		} else {
			$db_where['nda_ID'] = $nda_ID;
		}

		$results = $this->db->select('ndas', $db_where);
		if ($results) {
			while($nda = mysql_fetch_assoc($results)) {
				$return[] = $nda;
			}
			if ($nda_ID || $nda_ID == 0) {
				$return = $return[0];
			}
		}

		return $return;
	}
	
	/*
	replace nda detials
	session company only (privacy)
	*/
	function put($request_data = NULL) {
		$return = array();
		$params = array(
			"nda_ID",
			"nda_title",
			"nda_details",
			//"timestamp_create",
			//"timestamp_update",
		);

		foreach ($params as $key) {
			$request_data[$key] = isset($request_data[$key]) ? $request_data[$key] : NULL;
		}
		
		// Check permissions
		if(!$this->permission->check($request_data)) {
			return $this->permission->errorMessage();
		};
		
		// company //
		$nda = array(
			"nda_ID"				=> $request_data["nda_ID"],
			"company_ID"			=> COMPANY_ID,

			"nda_title"				=> $request_data["nda_title"],
			"nda_details"			=> $request_data["nda_details"],
			//"timestamp_create"		=> $request_data["timestamp_create"],
			"timestamp_update"		=> $_SERVER['REQUEST_TIME'],
		);
		if (!$request_data["nda_ID"]) $nda["timestamp_create"] = $_SERVER['REQUEST_TIME'];
		$nda_ID = $this->db->insert_update('ndas', $nda);
		
		
		return array("nda_ID" => $nda_ID);
	}
	
	function delete() {
		
	}
	
}
	
?>