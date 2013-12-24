<?php
set_time_limit(0);
chdir (dirname(__FILE__));
require_once 'config.php';
require_once 'Zend/Loader.php';
Zend_Loader::loadClass('Zend_Gdata_AuthSub');
Zend_Loader::loadClass('Zend_Gdata_ClientLogin');
Zend_Loader::loadClass('Zend_Gdata_Spreadsheets');
Zend_Loader::loadClass('Zend_Gdata_Docs');
Zend_Loader::loadClass('Zend_Session_Namespace');

$user = $config->USER;
$pass = $config->PASS;
$spreadsheetKey = $config->SPKEY;

try {
	$service = Zend_Gdata_Spreadsheets::AUTH_SERVICE_NAME;
	$client = Zend_Gdata_ClientLogin::getHttpClient($user, $pass, $service);
	$spreadsheetService = new Zend_Gdata_Spreadsheets($client);
	//$feedSpreadsheet = $spreadsheetService->getSpreadsheetFeed();

	//workshee
	$query = new Zend_Gdata_Spreadsheets_DocumentQuery();
	$query->setSpreadsheetKey($spreadsheetKey);
	$feedWorksheet = $spreadsheetService->getWorksheetFeed($query);

	foreach($feedWorksheet->entries as $worksheet)
	{
		$worksheetId = basename($worksheet->id);
		//check worksheet is jatc or jmtc if need, ($worksheet->getName())
		$updateColumns = array('rating' => 0, 'downloads' => 0);
		$keyColum = 'url';
		$keyIndex = 0;

		$cellFeed = $spreadsheetService->getCellFeed($worksheet);
		$totalCol = 0;
		$hasColumn = 0;
		foreach($cellFeed as $cellEntry) {
			//var_dump(get_class_methods(get_class($cellEntry->cell)));exit();
			$row = $cellEntry->cell->getRow();
			$col = $cellEntry->cell->getColumn();
			$val = $cellEntry->cell->getText();
			if($row > 1) break;
			
			$val = strtolower(trim($val));
			if($val == $keyColum) {
				$keyIndex = $col;
			}
			
			foreach ($updateColumns as $key => $index) {
				if($val == $key) {
					$hasColumn = 1;
					$updateColumns[$key] = $col;
				}
			}
			$totalCol++;
		}
		if(!$keyIndex || !$hasColumn) {
			//throw new Exception('Do not found the colum: '.$keyColum);
			break;
		}
		
		$rIndex = 0;
		foreach($cellFeed as $cellEntry) {
			$row = $cellEntry->cell->getRow();
			if($row == 1) continue;
			$col = $cellEntry->cell->getColumn();
			if($rIndex != $row) {
				//new row
				$rIndex = $row;
				$templateUrl = '';
			}
			if ($col == $keyIndex) {
				$templateUrl = $cellEntry->cell->getText();
				if(!empty($templateUrl)) {
					preg_match('#joomlart.com/([a-zA-Z0-9_]+)#i', $templateUrl, $matches);
					if(is_array($matches) && isset($matches[1])) {
						$templateName = strtolower($matches[1]);
						if(strpos($templateName, 'ja_') == 0) {
							$jver = (strpos($templateUrl, 'templates.joomlart.com') !== false) ? '15' : '17';
						}
						
						if($updateColumns['downloads']) {
							$infoUrl = 'http://www.joomlart.com/forums/productinfo.php?key='.$templateName;
							$info = file_get_contents($infoUrl);
							$info = unserialize($info);
							$totaldownloads = 0;
							if(is_array($info) && count($info)) {
								foreach ($info as $downloadItem) {
									if(isset($downloadItem->totaldownloads) && $downloadItem->totaldownloads > $totaldownloads) {
										$totaldownloads = $downloadItem->totaldownloads;
									}
								}
							}
							
						    $updatedCell = $spreadsheetService->updateCell($row,
                                               $updateColumns['downloads'],
                                               $totaldownloads,
                                               $spreadsheetKey,
                                               $worksheetId);
						}
						
						if($updateColumns['rating']) {
							$infoUrl = 'http://www.joomlart.com/templateinfo.php?key='.$templateName;
							$info = file_get_contents($infoUrl);
							$info = json_decode($info);
							
							if(is_object($info) && property_exists($info, 'rating_count')) {
								$rating = ($info->rating_count) ? ((float)$info->rating_sum/(float)$info->rating_count) : 0;
								$rating = number_format($rating, 1, '.', '');
							    $updatedCell = $spreadsheetService->updateCell($row,
	                                               $updateColumns['rating'],
	                                               $rating,
	                                               $spreadsheetKey,
	                                               $worksheetId);
							}
						}
						
					}
				}
			}
		}
	}
	$token = time();
	$file = dirname(__FILE__).'/tmp/jatoken.txt';
	file_put_contents($file, $token);
	$_GET['jatoken'] = $token;
	$_GET['update'] = 1;
	include_once('builder.php');
	
} catch (Exception $e) {
	echo $e->getMessage();
	exit();
}
