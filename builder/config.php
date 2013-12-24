<?php 
class config {
	public $USER = '';
	public $PASS = '';
	public $SPKEY = '0Apz6QtDdronfdG5zQ1ZPbDA3TEVGNFpPQ29hRXZSRnc';

	// enable special tab
	public $SPECIAL = false;

	// Visible tags for each catalogs
	public $VISIBLE_TAGS = array(
						'jatc'=>array('responsive','business','news'), 
						'jmtc'=>array('lifestyle', 'movies', 'digital'),
						);
	public $VISIBLE_YEARS = 2;
}

$config = new config();