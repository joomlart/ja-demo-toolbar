<?php
error_reporting(E_ALL ^ E_NOTICE);

set_include_path(get_include_path() . PATH_SEPARATOR . dirname(__FILE__));

require_once 'config.php';

//$_CATALOGS = array('jatc', 'jmtc');

if (!is_file(dirname(__FILE__).'/data.cache.php') || isset($_GET['updatedata']) || isset($_GET['update'])) {
    require_once dirname(__FILE__).'/data.php';
    $gdata = new DataBuilder();
    $gdata->checkLogin();
    $data = $gdata->getData();
    // cache data
    file_put_contents(dirname(__FILE__).'/data.cache.php', "<?php \r\n \$data=".var_export($data, true).";\n");

    // if is update data, reload with cache
    if (isset($_GET['updatedata'])) {
        header('Location: ./update.php');
        exit;
    }
} else {
    require_once dirname(__FILE__).'/data.cache.php';
}

// Catalogs
$_CATALOGS = $data['catalogs'];
$_VISIBLE_TAGS = $config->VISIBLE_TAGS;
$_VISIBLE_YEARS = $config->VISIBLE_YEARS;
// 
ob_start();
?>
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Joomla Templates &amp; Magento Themes Demo</title>
  <!-- META FOR IOS & HANDHELD -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <meta name="HandheldFriendly" content="true" />
  <meta name="apple-touch-fullscreen" content="YES" />
	<link href="/images/ja-favicon.ico" rel="shortcut icon" type="image/vnd.microsoft.icon" />
  <!-- //META FOR IOS & HANDHELD -->
  <link rel="stylesheet" type="text/css" href="css/reset.css" />
  <link rel="stylesheet" type="text/css" href="css/core.css" />
  <link rel="stylesheet" type="text/css" href="css/style.css" />
  <!-- MEDIA QUERIES -->
  <link rel="stylesheet" type="text/css" href="css/screens/tablet.css" media="only screen and (min-width:720px) and (max-width: 985px)" />
  <link rel="stylesheet" type="text/css" href="css/screens/normal.css" media="only screen and (min-width:986px) and (max-width: 1235px)" />
  <link rel="stylesheet" type="text/css" href="css/screens/wide.css" media="only screen and (min-width:1236px)" />
  <!-- //MEDIA QUERIES -->
  <script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>
  <script type="text/javascript" src="js/jquery.lazyload.min.js"></script>
  <script type="text/javascript" src="js/jquery.mousewheel.js"></script>
  <script type="text/javascript" src="js/jquery.ckie.js"></script>
	<!--[if lt IE 9]>
	<script type="text/javascript" src="js/jquery.mediaqueries.js"></script>
	<![endif]-->
  <script type="text/javascript" src="js/script2.js?v=5"></script>
</head>

<body>

<div id="demo-page" class="wrap">
  <div class="main">

    <!-- TOOLBAR -->
    <div id="toolbar">
      <div class="toolbar-inner">

        <!-- LOGO -->
        <h1 id="logo">
          <a href="http://www.joomlart.com" title="joomlart">JoomlArt</a>
        </h1>
        <!-- //LOGO -->

        <!-- SELECTOR -->
        <div class="toolbar-main">
          <div id="catalog-types" class="">
            <div class="types">
              <?php foreach ($_CATALOGS as $cat): 
                if ($cat == 'special') continue; // display special products in special catalog in separated layout
              ?>              
                <a data-catalog="<?php echo $cat ?>" href="#" class="type-<?php echo $cat ?>" title="<?php echo $cat ?>"><span><?php echo $cat ?></span></a>
              <?php endforeach ?>        

              <?php if ($config->SPECIAL): ?>
                <a data-catalog="special" href="#" class="type-special" title="JA Wall"><span>JA Wall</span></a>
              <?php endif ?>
            </div>
          </div>

          <div id="catalog-selector" class="">
            <div class="product-name">
              <h3>Product Title</h3>
            </div>
           <div class="badge-wrap">
              <span class="badge badge-premium">Premium</span>
              <span class="badge badge-featured">Featured</span>
              <span class="badge badge-free">Free</span>
              <span class="badge badge-j30">J3.1</span>
              <span class="badge badge-j25">J2.5</span>
              <span class="badge badge-j15">J1.5</span>
            </div>
            <div class="catalog-indicator"></div>
            <div class="catalog-arrow"></div>
          </div>
          
          <div id="demo-actions" class="">
            <a href="#" class="btn-get-it-now" title="Get it now!"><span>Join Now!</span></a>
          </div>
          
          <!-- SOCIAL SHARING-->
          <div class="social">
            <span class='social-button st_facebook_large' title='Facebook'></span>
            <span class='social-button st_twitter_large' title='Tweet'></span>
            <span class='social-button st_googleplus_large' title='Google +'></span>
          </div>
          <!-- //SOCIAL SHARING-->
        </div>
        <!-- //SELECTOR  -->
        
        <a href="#" class="btn-close" title="Close the toolbar">Close the toolbar</a>

      </div>
    </div>
    <!-- //TOOLBAR -->
      
    <!-- CATALOG -->
    <div id="catalog">
      <div class="catalog-main clearfix">

        <?php foreach ($_CATALOGS as $cat): 
          if ($cat == 'special') continue; // display special products in special catalog in separated layout
        ?>
        <div class="catalog-inner catalog-<?php echo $cat ?> clearfix" data-catalog="<?php echo $cat ?>">  

          <!-- FILTERS -->
          <div class="filters-wrap">
            <div class="filters-inner">

              <div class="filters filter-years">
                <a href="#" class="filter current">All Times</a>
                <?php 
                $years = array_keys ($data[$cat.'-years']);
                for ($i=0; $i<$_VISIBLE_YEARS && $i<count($years); $i++) :
                    $year = $years[$i];
                ?>
                <a href="#year-<?php echo $year ?>" class="filter"><?php echo $year ?> <span class="counter"><?php echo $data[$cat.'-years'][$year] ?></span></a>
	              <?php endfor; ?>
                <?php if ($_VISIBLE_YEARS < count($years)) : ?>
                <div class="filter-more">
                  <span class="more">Older</span>
                  <div class="more-childs">
                    <?php 
                    for ($i=$_VISIBLE_YEARS; $i<count($years); $i++) :
                        $year = $years[$i];
                    ?>
                    <a href="#year-<?php echo $year ?>" class="filter"><?php echo $year ?> <span class="counter"><?php echo $data[$cat.'-years'][$year] ?></span></a>      
                    <?php endfor; ?>                        
                  </div>
                </div>
                <?php endif ?>
              </div>

              <div class="filters filter-categories">
                <a href="#" class="filter current">All tags</a>
                <?php 
                $tags = array_keys ($data[$cat.'-tags']);
                if (isset($_VISIBLE_TAGS[$cat])) :
                  if (is_string($_VISIBLE_TAGS[$cat]) && strtolower($_VISIBLE_TAGS[$cat]) == 'all') {
                    $_VISIBLE_TAGS[$cat] = $tags;
                    $tags = null;
                  }
                foreach ($_VISIBLE_TAGS[$cat] as $tag) :
									if ($data[$cat.'-tags'][$tag]) :
                ?>
                <a href="#<?php echo $tag ?>" class="filter"><?php echo $tag ?> <span class="counter"><?php echo $data[$cat.'-tags'][$tag] ?></span></a>
								<?php 
									endif;
								endforeach; 
                endif; ?>
                <?php if ($tags) : ?>
                <div class="filter-more">
                  <span class="more">More...</span>
                  <div class="more-childs"> 
                      <?php foreach ($tags as $tag) : 
                          // ignore if tag in visible_tags
                          if (isset($_VISIBLE_TAGS[$cat]) && in_array($tag, $_VISIBLE_TAGS[$cat])) continue;
                          // ignore if too less items
                          // if ($data[$cat.'-tags'][$tag] < 3) continue;
                      ?>
                          <a href="#<?php echo $tag ?>" class="filter"><?php echo $tag ?> <span class="counter"><?php echo $data[$cat.'-tags'][$tag] ?></span></a>
                      <?php endforeach; ?>
                  </div>
                </div>
                <?php endif ?>
              </div>

            </div>
          </div>
          <!-- FILTERS -->
        
          <!-- PRODUCTS -->
          <div class="products-wrap">
            <div class="products-wrap-inner clearfix">
              <div class="products">
                <!-- PRODUCT TEMPLATE -->
  		          <?php foreach ($data[$cat] as $product) : ?>
                <div class="product <?php echo $product['tags'] ?> year-<?php echo $product['year'] ?> <?php echo $product['classes'] ?> <?php echo $product['badge'] ?>" data-name="<?php echo $product['name'] ?>" data-url="<?php echo $product['url'] ?>" data-badge="<?php echo $product['badge'] ?>">
                  <div class="product-inner">

                    <div class="product-image">
                      <div class="image-inset">
                        <img class="lazy" src="images/products/blank.png" data-original="<?php echo $product['image'] ?>" alt="<?php echo $product['title'] ?>" />
                      </div>
                    </div>

                    <div class="product-info">
                      <h3><?php echo $product['title'] ?></h3>
                      <?php if ($product['downloads']) : ?>
                      <div class="product-download" title="Downloads <?php echo number_format($product['downloads']) ?> times">
                        <?php echo number_format($product['downloads']) ?>
                      </div>
                      <?php endif ?>
                      <div class="product-desc">
                        <p class="date"><?php echo $product['desc'] ?></p>
                        <?php if ($product['rating']) : ?>
                        <div class="rating" title="Rated <?php echo number_format($product['rating'], 1) ?> out of 5 stars">
                        <div class="current" style="width: <?php echo $product['rating']*100/5 ?>%;">&nbsp;</div>
                        </div>
                        <?php endif ?>
                      </div>
                      <div class="badge-wrap">
                        <span class="badge badge-premium">Premium</span>
                        <span class="badge badge-featured">Featured</span>
                        <span class="badge badge-free">Free</span>
                        <span class="badge badge-j30">J3.1</span>
                        <span class="badge badge-j25">J2.5</span>
                        <span class="badge badge-j15">J1.5</span>
                      </div>
                    </div>

                  </div>
                </div>
  		          <?php endforeach ?>
                <!-- //PRODUCT TEMPLATE -->
              </div>
            </div>          
          </div>
          <!-- PRODUCTS -->
          
          <!-- PAGINATION -->
          <div class="pagination-wrap">
            <div class="pagination-inner clearfix">
              <ul class="pagination">
                 <li class="prev"><span>Prev</span></li><!--
              --><li class="hide"><span>1</span></li><!--
              --><li class="hide"><span>2</span></li><!--
              --><li class="hide"><span>3</span></li><!--
              --><li class="hide"><span>4</span></li><!--
              --><li class="hide"><span>5</span></li><!--
              --><li class="hide"><span>6</span></li><!--
              --><li class="hide"><span>7</span></li><!--
              --><li class="hide"><span>8</span></li><!--
              --><li class="hide"><span>9</span></li><!--
              --><li class="hide"><span>10</span></li><!--
              --><li class="hide"><span>11</span></li><!--
              --><li class="hide"><span>12</span></li><!--
              --><li class="hide"><span>13</span></li><!--
              --><li class="hide"><span>14</span></li><!--
              --><li class="hide"><span>15</span></li><!--
              --><li class="hide"><span>16</span></li><!--
              --><li class="hide"><span>17</span></li><!--
              --><li class="hide"><span>18</span></li><!--
              --><li class="hide"><span>19</span></li><!--
              --><li class="next"><span>Next</span></li>
              </ul>
            </div>
          </div>
          <!-- PAGINATION -->
          
        </div>
        <?php endforeach; ?> 
        <?php if ($config->SPECIAL): ?>
        <!-- SPECIAL CATALOG -->
        <div class="catalog-inner catalog-special clearfix" data-catalog="special"> 
          <?php include 'special-catalog.php' ?>
        </div>
        <!-- // SPECIAL CATALOG -->
        <?php endif ?>
      </div>
    </div> 
    <!-- //CATALOG -->

  </div>
</div>

<div id="demo-container">
  <iframe id="fraDemo" name="fraDemo" src="about:blank" frameborder="0"></iframe>
</div>

<div id="demo-overlay" class="animate">
  <div class="loading-indicator">
    Loading...
	<div class="rw-words">
<!--		<span>awesome design</span>
		<span>solid framework</span>
                <span>flexible layout</span>
		<span>usable typography</span>
		<span>fully responsive</span>
		<span>multi styles</span>-->
	</div>
	</div>
</div>
<script type="text/javascript">
  
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-243376-9']);
  _gaq.push(['_setDomainName', '.themebrain.com']);
  _gaq.push(['_trackPageview']);
  
  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
  
</script>
</body>
</html>
<?php
$html = ob_get_clean();
if (isset($_GET['update'])) { 
	// put to index.html
	file_put_contents(dirname(dirname(__FILE__)).'/index.html', $html);
} else {
	echo $html;
}