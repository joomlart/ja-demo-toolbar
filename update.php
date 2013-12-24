<?php
include dirname(__FILE__).'/builder/builder.php';

if (isset($_GET['update'])) { 
	// redirect to output page
	header('Location: ./index.html');
} else {
  // export button 
  ?>
  <script type="text/javascript">
    jQuery(function($){
      var update_btn = $(
      	'<span id="export_btn"><a href="?update" title="Update the demo">Export</a></span>\n' +
      	'<span id="update_btn"><a href="?updatedata" title="Update the demo">Update Data</a></span>'
      	).appendTo ($('body'));
    })
  </script>
<?php
}
?>