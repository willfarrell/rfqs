<?php
$filter_table = array (
  'table_companies' => 
  array (
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'is_natural_no_zero|integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'company_hash' => 
    array (
      'field' => 'company_hash',
      'label' => 'Company Hash',
      'rules' => 'max_length[255]',
    ),
    'company_name' => 
    array (
      'field' => 'company_name',
      'label' => 'Company Name',
      'rules' => 'max_length[65535]',
    ),
    'company_url' => 
    array (
      'field' => 'company_url',
      'label' => 'Company Url',
      'rules' => 'max_length[65535]',
    ),
    'company_phone' => 
    array (
      'field' => 'company_phone',
      'label' => 'Company Phone',
      'rules' => 'max_length[255]',
    ),
    'company_details' => 
    array (
      'field' => 'company_details',
      'label' => 'Company Details',
      'rules' => 'max_length[65535]',
    ),
    'user_default_ID' => 
    array (
      'field' => 'user_default_ID',
      'label' => 'User Default ID',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'location_default_ID' => 
    array (
      'field' => 'location_default_ID',
      'label' => 'Location Default ID',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'timestamp_create' => 
    array (
      'field' => 'timestamp_create',
      'label' => 'Timestamp Create',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'timestamp_update' => 
    array (
      'field' => 'timestamp_update',
      'label' => 'Timestamp Update',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
  ),
  'table_follow_company' => 
  array (
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'follow_ID' => 
    array (
      'field' => 'follow_ID',
      'label' => 'Follow ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'group_ID' => 
    array (
      'field' => 'group_ID',
      'label' => 'Group ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp' => 
    array (
      'field' => 'timestamp',
      'label' => 'Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_follow_company_groups' => 
  array (
    'group_ID' => 
    array (
      'field' => 'group_ID',
      'label' => 'Group ID',
      'rules' => 'is_natural_no_zero|integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'group_name' => 
    array (
      'field' => 'group_name',
      'label' => 'Group Name',
      'rules' => 'max_length[255]',
    ),
    'group_count' => 
    array (
      'field' => 'group_count',
      'label' => 'Group Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'group_color' => 
    array (
      'field' => 'group_color',
      'label' => 'Group Color',
      'rules' => 'max_length[255]',
    ),
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_follow_tender' => 
  array (
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'tender_ID' => 
    array (
      'field' => 'tender_ID',
      'label' => 'Tender ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp' => 
    array (
      'field' => 'timestamp',
      'label' => 'Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_follow_user' => 
  array (
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'follow_ID' => 
    array (
      'field' => 'follow_ID',
      'label' => 'Follow ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'group_ID' => 
    array (
      'field' => 'group_ID',
      'label' => 'Group ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp' => 
    array (
      'field' => 'timestamp',
      'label' => 'Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_follow_user_groups' => 
  array (
    'group_ID' => 
    array (
      'field' => 'group_ID',
      'label' => 'Group ID',
      'rules' => 'is_natural_no_zero|integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'group_name' => 
    array (
      'field' => 'group_name',
      'label' => 'Group Name',
      'rules' => 'max_length[255]',
    ),
    'group_count' => 
    array (
      'field' => 'group_count',
      'label' => 'Group Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'group_color' => 
    array (
      'field' => 'group_color',
      'label' => 'Group Color',
      'rules' => 'max_length[255]',
    ),
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_locations' => 
  array (
    'location_ID' => 
    array (
      'field' => 'location_ID',
      'label' => 'Location ID',
      'rules' => 'is_natural_no_zero|integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'location_name' => 
    array (
      'field' => 'location_name',
      'label' => 'Location Name',
      'rules' => 'max_length[255]',
    ),
    'location_phone' => 
    array (
      'field' => 'location_phone',
      'label' => 'Location Phone',
      'rules' => 'max_length[255]',
    ),
    'address_1' => 
    array (
      'field' => 'address_1',
      'label' => 'Address 1',
      'rules' => 'max_length[65535]',
    ),
    'address_2' => 
    array (
      'field' => 'address_2',
      'label' => 'Address 2',
      'rules' => 'max_length[65535]',
    ),
    'city' => 
    array (
      'field' => 'city',
      'label' => 'City',
      'rules' => 'max_length[255]',
    ),
    'region_code' => 
    array (
      'field' => 'region_code',
      'label' => 'Region Code',
      'rules' => 'max_length[255]',
    ),
    'country_code' => 
    array (
      'field' => 'country_code',
      'label' => 'Country Code',
      'rules' => 'max_length[255]',
    ),
    'mail_code' => 
    array (
      'field' => 'mail_code',
      'label' => 'Mail Code',
      'rules' => 'max_length[255]',
    ),
    'latitude' => 
    array (
      'field' => 'latitude',
      'label' => 'Latitude',
      'rules' => 'decimal[9,6]',
    ),
    'longitude' => 
    array (
      'field' => 'longitude',
      'label' => 'Longitude',
      'rules' => 'decimal[9,6]',
    ),
    'timestamp_create' => 
    array (
      'field' => 'timestamp_create',
      'label' => 'Timestamp Create',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp_update' => 
    array (
      'field' => 'timestamp_update',
      'label' => 'Timestamp Update',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_messages' => 
  array (
    'user_key' => 
    array (
      'field' => 'user_key',
      'label' => 'User Key',
      'rules' => 'max_length[255]',
    ),
    'user_to_ID' => 
    array (
      'field' => 'user_to_ID',
      'label' => 'User To ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'user_from_ID' => 
    array (
      'field' => 'user_from_ID',
      'label' => 'User From ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp' => 
    array (
      'field' => 'timestamp',
      'label' => 'Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'message' => 
    array (
      'field' => 'message',
      'label' => 'Message',
      'rules' => 'max_length[65535]',
    ),
    'read' => 
    array (
      'field' => 'read',
      'label' => 'Read',
      'rules' => 'integer|max_length[4]|greater_than_or_equal[-128]|less_than_or_equal[127]',
    ),
  ),
  'table_ndas' => 
  array (
    'nda_ID' => 
    array (
      'field' => 'nda_ID',
      'label' => 'Nda ID',
      'rules' => 'is_natural_no_zero|integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'nda_title' => 
    array (
      'field' => 'nda_title',
      'label' => 'Nda Title',
      'rules' => 'max_length[255]',
    ),
    'nda_details' => 
    array (
      'field' => 'nda_details',
      'label' => 'Nda Details',
      'rules' => 'max_length[65535]',
    ),
    'timestamp_create' => 
    array (
      'field' => 'timestamp_create',
      'label' => 'Timestamp Create',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp_update' => 
    array (
      'field' => 'timestamp_update',
      'label' => 'Timestamp Update',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_password_blacklist' => 
  array (
    'password' => 
    array (
      'field' => 'password',
      'label' => 'Password',
      'rules' => 'max_length[255]',
    ),
    'length' => 
    array (
      'field' => 'length',
      'label' => 'Length',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'upper_count' => 
    array (
      'field' => 'upper_count',
      'label' => 'Upper Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'lower_count' => 
    array (
      'field' => 'lower_count',
      'label' => 'Lower Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'number_count' => 
    array (
      'field' => 'number_count',
      'label' => 'Number Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'symbol_count' => 
    array (
      'field' => 'symbol_count',
      'label' => 'Symbol Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'special_count' => 
    array (
      'field' => 'special_count',
      'label' => 'Special Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'use_count' => 
    array (
      'field' => 'use_count',
      'label' => 'Use Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp' => 
    array (
      'field' => 'timestamp',
      'label' => 'Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_password_dictionary' => 
  array (
    'word' => 
    array (
      'field' => 'word',
      'label' => 'Word',
      'rules' => 'max_length[255]',
    ),
    'lang' => 
    array (
      'field' => 'lang',
      'label' => 'Lang',
      'rules' => 'max_length[255]',
    ),
    'length' => 
    array (
      'field' => 'length',
      'label' => 'Length',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_sessions' => 
  array (
    'PHPSESSID' => 
    array (
      'field' => 'PHPSESSID',
      'label' => 'PHPSESSID',
      'rules' => 'max_length[255]',
    ),
    'ip' => 
    array (
      'field' => 'ip',
      'label' => 'Ip',
      'rules' => 'max_length[65535]',
    ),
    'ua' => 
    array (
      'field' => 'ua',
      'label' => 'Ua',
      'rules' => 'max_length[65535]',
    ),
    'lang' => 
    array (
      'field' => 'lang',
      'label' => 'Lang',
      'rules' => 'max_length[255]',
    ),
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'user_email' => 
    array (
      'field' => 'user_email',
      'label' => 'User Email',
      'rules' => 'max_length[255]',
    ),
    'user_level' => 
    array (
      'field' => 'user_level',
      'label' => 'User Level',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'remember' => 
    array (
      'field' => 'remember',
      'label' => 'Remember',
      'rules' => 'integer|max_length[4]|greater_than_or_equal[-128]|less_than_or_equal[127]',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'timestamp' => 
    array (
      'field' => 'timestamp',
      'label' => 'Timestamp',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
  ),
  'table_tender_company' => 
  array (
    'tender_ID' => 
    array (
      'field' => 'tender_ID',
      'label' => 'Tender ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'request_timestamp' => 
    array (
      'field' => 'request_timestamp',
      'label' => 'Request Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'invite_timestamp' => 
    array (
      'field' => 'invite_timestamp',
      'label' => 'Invite Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'approved_timestamp' => 
    array (
      'field' => 'approved_timestamp',
      'label' => 'Approved Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_tender_nda_signature' => 
  array (
    'tender_ID' => 
    array (
      'field' => 'tender_ID',
      'label' => 'Tender ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'nda_ID' => 
    array (
      'field' => 'nda_ID',
      'label' => 'Nda ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'signature' => 
    array (
      'field' => 'signature',
      'label' => 'Signature',
      'rules' => 'max_length[65535]',
    ),
    'signature_hash' => 
    array (
      'field' => 'signature_hash',
      'label' => 'Signature Hash',
      'rules' => 'max_length[65535]',
    ),
    'signature_ip' => 
    array (
      'field' => 'signature_ip',
      'label' => 'Signature Ip',
      'rules' => 'max_length[65535]',
    ),
    'signature_timestamp' => 
    array (
      'field' => 'signature_timestamp',
      'label' => 'Signature Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_tender_user' => 
  array (
    'tender_ID' => 
    array (
      'field' => 'tender_ID',
      'label' => 'Tender ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_tenders' => 
  array (
    'tender_ID' => 
    array (
      'field' => 'tender_ID',
      'label' => 'Tender ID',
      'rules' => 'is_natural_no_zero|integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'tender_hash' => 
    array (
      'field' => 'tender_hash',
      'label' => 'Tender Hash',
      'rules' => 'max_length[255]',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'title' => 
    array (
      'field' => 'title',
      'label' => 'Title',
      'rules' => 'max_length[65535]',
    ),
    'ref_ID' => 
    array (
      'field' => 'ref_ID',
      'label' => 'Ref ID',
      'rules' => 'max_length[255]',
    ),
    'tender_type' => 
    array (
      'field' => 'tender_type',
      'label' => 'Tender Type',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'url' => 
    array (
      'field' => 'url',
      'label' => 'Url',
      'rules' => 'max_length[65535]',
    ),
    'details' => 
    array (
      'field' => 'details',
      'label' => 'Details',
      'rules' => 'max_length[4294967295]',
    ),
    'categories' => 
    array (
      'field' => 'categories',
      'label' => 'Categories',
      'rules' => 'max_length[65535]',
    ),
    'tags' => 
    array (
      'field' => 'tags',
      'label' => 'Tags',
      'rules' => 'max_length[65535]',
    ),
    'location_ID' => 
    array (
      'field' => 'location_ID',
      'label' => 'Location ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'post_timestamp' => 
    array (
      'field' => 'post_timestamp',
      'label' => 'Post Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'question_timestamp' => 
    array (
      'field' => 'question_timestamp',
      'label' => 'Question Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'close_timestamp' => 
    array (
      'field' => 'close_timestamp',
      'label' => 'Close Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'privacy' => 
    array (
      'field' => 'privacy',
      'label' => 'Privacy',
      'rules' => 'integer|max_length[4]|greater_than_or_equal[-128]|less_than_or_equal[127]',
    ),
    'invited_companies' => 
    array (
      'field' => 'invited_companies',
      'label' => 'Invited Companies',
      'rules' => 'max_length[65535]',
    ),
    'invited_users' => 
    array (
      'field' => 'invited_users',
      'label' => 'Invited Users',
      'rules' => 'max_length[65535]',
    ),
    'nda_ID' => 
    array (
      'field' => 'nda_ID',
      'label' => 'Nda ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp_create' => 
    array (
      'field' => 'timestamp_create',
      'label' => 'Timestamp Create',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp_update' => 
    array (
      'field' => 'timestamp_update',
      'label' => 'Timestamp Update',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_user_confirm' => 
  array (
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'hash' => 
    array (
      'field' => 'hash',
      'label' => 'Hash',
      'rules' => 'max_length[255]',
    ),
  ),
  'table_user_reset' => 
  array (
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'hash' => 
    array (
      'field' => 'hash',
      'label' => 'Hash',
      'rules' => 'max_length[255]',
    ),
    'expire_timestamp' => 
    array (
      'field' => 'expire_timestamp',
      'label' => 'Expire Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_users' => 
  array (
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'is_natural_no_zero|integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'user_level' => 
    array (
      'field' => 'user_level',
      'label' => 'User Level',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'user_email' => 
    array (
      'field' => 'user_email',
      'label' => 'User Email',
      'rules' => 'max_length[255]',
    ),
    'user_name' => 
    array (
      'field' => 'user_name',
      'label' => 'User Name',
      'rules' => 'max_length[255]',
    ),
    'user_name_first' => 
    array (
      'field' => 'user_name_first',
      'label' => 'User Name First',
      'rules' => 'max_length[65535]',
    ),
    'user_name_last' => 
    array (
      'field' => 'user_name_last',
      'label' => 'User Name Last',
      'rules' => 'max_length[65535]',
    ),
    'user_phone' => 
    array (
      'field' => 'user_phone',
      'label' => 'User Phone',
      'rules' => 'max_length[255]',
    ),
    'user_function' => 
    array (
      'field' => 'user_function',
      'label' => 'User Function',
      'rules' => 'max_length[65535]',
    ),
    'user_url' => 
    array (
      'field' => 'user_url',
      'label' => 'User Url',
      'rules' => 'max_length[255]',
    ),
    'user_dob' => 
    array (
      'field' => 'user_dob',
      'label' => 'User Dob',
      'rules' => '',
    ),
    'user_details' => 
    array (
      'field' => 'user_details',
      'label' => 'User Details',
      'rules' => 'max_length[65535]',
    ),
    'password' => 
    array (
      'field' => 'password',
      'label' => 'Password',
      'rules' => 'max_length[65535]',
    ),
    'password_timestamp' => 
    array (
      'field' => 'password_timestamp',
      'label' => 'Password Timestamp',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'password_history' => 
    array (
      'field' => 'password_history',
      'label' => 'Password History',
      'rules' => 'max_length[65535]',
    ),
    'referral_user_ID' => 
    array (
      'field' => 'referral_user_ID',
      'label' => 'Referral User ID',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'timestamp_create' => 
    array (
      'field' => 'timestamp_create',
      'label' => 'Timestamp Create',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'timestamp_confirm' => 
    array (
      'field' => 'timestamp_confirm',
      'label' => 'Timestamp Confirm',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'timestamp_update' => 
    array (
      'field' => 'timestamp_update',
      'label' => 'Timestamp Update',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
    'timestamp_delete' => 
    array (
      'field' => 'timestamp_delete',
      'label' => 'Timestamp Delete',
      'rules' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
  ),
);
?>