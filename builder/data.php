<?php
chdir (dirname(__FILE__));
require_once 'Zend/Loader.php';
Zend_Loader::loadClass('Zend_Gdata_AuthSub');
Zend_Loader::loadClass('Zend_Gdata_ClientLogin');
Zend_Loader::loadClass('Zend_Gdata_Spreadsheets');
Zend_Loader::loadClass('Zend_Gdata_Docs');
Zend_Loader::loadClass('Zend_Session_Namespace');

$fileToken = dirname(__FILE__).'/tmp/jatoken.txt';
class DataBuilder {
	protected $_session;
	protected $_title = 'Test Spreadsheet';
	protected $message = 'Message';
	protected $key = '';
	protected $mode = 'token';

	public function __construct ()
	{
		global $config; 
		$this->key = $config->SPKEY;
		$this->_session = new Zend_Session_Namespace('GsheetsController');
	}

	// Must login to use this tool
	public function checkLogin()
	{
		if (!isset($this->_session->sheet_token))
		{
			if (isset($_GET['token']))
			{
				$this->mode = 'token';
				// You can convert the single-use token to a session token.
				$token = $_GET['token'];
				$session_token =  Zend_Gdata_AuthSub::getAuthSubSessionToken($token);
				// Store the session token in our session.
				$this->_session->sheet_token = $session_token;
			} elseif (isset($_GET['jatoken'])) {
				$this->mode = 'account';
				$checkToken = file_get_contents(dirname(__FILE__).'/tmp/jatoken.txt');
				if($checkToken != $_GET['jatoken']) {
					exit('Invalid Token!');
				}
			} else {
				// Display link to generate single-use token
				$url = 'http://'. $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
				$scope = 'http://spreadsheets.google.com/feeds';
				$secure = false;
				$session = true;
				$googleUri = Zend_Gdata_AuthSub::getAuthSubTokenUri(
				$url, $scope, $secure, $session);
				echo "Go <a href='$googleUri'>Google Login Screen</a>";
				exit;
			}
		}
	}
	public function logout() {
		if (isset($this->_session->sheet_token))
		{
			Zend_Gdata_AuthSub::AuthSubRevokeToken($this->_session->sheet_token);
			unset($this->_session->sheet_token);
		}
		$this->message = "Thank you.";
	}

	public function run () {
		$task = isset($_GET['t'])?$_GET['t']:'';
		switch ($task) {
			case 'logout':
				$this->logout();
				break;
			case 'build':
				$this->build();
				break;
		}
		$this->index();
	}

	function index () {
		?>
		<ul class="nav">
			<?php if (isset($this->_session->sheet_token)): ?>
			<li><a href="?t=logout">Logout</a></li>
			<?php endif; ?>
			<li><a href="?t=build">Update Demo page</a></li>
		</ul>
		<div class="message"><?php echo $this->message ?></div>
		<?php
	}

	function build () {
		$this->getData();
		$this->message = "Build done";
	}

	public function getData () {
		if($this->mode == 'account') {
			$service = Zend_Gdata_Spreadsheets::AUTH_SERVICE_NAME;
			$client = Zend_Gdata_ClientLogin::getHttpClient('apps@joomsolutions.com', 'appsJoom', $service);
		} else {
			$client = Zend_Gdata_AuthSub::getHttpClient($this->_session->sheet_token);
		}

		$service = new Zend_Gdata_Spreadsheets($client);

		$query = new Zend_Gdata_Spreadsheets_DocumentQuery();
		$query->setSpreadsheetKey($this->key);
		$feed = $service->getWorksheetFeed($query);

		$data = array();
		$data['catalogs'] = array();
		for ($i=0;$i<count($feed->entries); $i++) {
			$cat = $feed->entries[$i]->title->text;
			$cat_data = $feed->entries[$i]->getContentsAsRows();

			$data['catalogs'][] = $cat; 

			$data [$cat] = array();
			$data [$cat.'-tags'] = array();
			$data [$cat.'-years'] = array();

			foreach ($cat_data as $row) {
				$row['name'] = str_replace(' ', '_', $row['name']);
				// process tags for this item
				$tags = preg_split('/\s+/',$row['tags'], -1, PREG_SPLIT_NO_EMPTY);
				$row['tags'] = implode (' ', $tags);
				foreach ($tags as $tag) {
					$data[$cat.'-tags'][$tag] = isset($data[$cat.'-tags'][$tag])?$data[$cat.'-tags'][$tag]+1:1;
				}
				$data[$cat.'-years'][$row['year']] = isset($data[$cat.'-years'][$row['year']])?$data[$cat.'-years'][$row['year']]+1:1;

				$data [$cat][] = $row;
			}
			krsort($data[$cat.'-years']);
			arsort($data[$cat.'-tags']);
		}

		return $data;
	}
}

/*
//-------------------------------------------------------------------------------
// Document key - get it from browser addres bar query key for your open spreadsheet
$key = 'tx1LYk4BpIQaglM38cJbTNA';
//---------------------------------------------------------------------------------
// Init Zend Gdata service
$service = Zend_Gdata_Spreadsheets::AUTH_SERVICE_NAME;
$client = Zend_Gdata_ClientLogin::getHttpClient($username, $password, $service);
$spreadSheetService = new Zend_Gdata_Spreadsheets($client);
//--------------------------------------------------------------------------------
// Example 1: Get cell data
$query = new Zend_Gdata_Spreadsheets_DocumentQuery();
$query->setSpreadsheetKey($key);
$feed = $spreadSheetService->getWorksheetFeed($query);
$entries =  q$feed->entries[0]->getContentsAsRows();
echo "<hr><h3>Example 1: Get cell data</h3>";
echo var_export($entries, true);
//----------------------------------------------------------------------------------
// Example 2: Get column information
$query = new Zend_Gdata_Spreadsheets_CellQuery();
$query->setSpreadsheetKey($key);
$feed = $spreadSheetService->getCellFeed($query);
$columnCount = $feed->getColumnCount()->getText();
$columns = array();
for ($i = 0; $i < $columnCount; $i++)
{
$columnName = $feed->entries[$i]->getCell()->getText();
$columns[$i] = strtolower(str_replace(' ', '', $columnName));
}
echo "<hr><h3>Example 2: Get column information</h3>";
echo "Nr of columns: $columnCount";
echo "<br>Columns: ";
echo var_export($columns, true);
//-------------------------------------------------------------------------------------------------
// Example 3: Add cell data
$testData = array();
foreach ($columns as $col)
{
$testData[$col] = "Dynamically added " . date("Y-m-d H:i:s") . " in column " . $col;
}
$ret = $spreadSheetService->insertRow($testData, $key);
//echo var_export($ret, true);
*/
