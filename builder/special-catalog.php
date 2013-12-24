<!-- FILTERS -->
<div class="filters-wrap">
  <div class="filters-inner">
    <div class="product-special-desc">
			<strong>"</strong>JA Wall is an independent template bundle of JA. It does not belong to Club Templates . Only Developer Membership can get free access.<strong>"</strong>
  	</div>
	</div>
</div>
<!-- // FILTERS -->

<!-- PRODUCTS -->
<div class="products-wrap">
  <div class="products-wrap-inner clearfix">
    <div class="products">

      <!-- STATIC SPECIAL CONTENT -->
      <div class="product featured">
        <div class="product-inner">

          <div class="product-image">
            <div class="image-inset">
              <?php $videourl = 'http://www.youtube.com/embed/s327DzvxmfQ?showinfo=0'; ?>
              <iframe id="intro-video" width="460" height="300" src="<?php echo $videourl ?>" frameborder="0" allowfullscreen></iframe>
              <script type="text/javascript"> $('#intro-video').attr('src', '<?php echo $videourl ?>'); </script>
            </div>
          </div>

        </div>
      </div>

      <div class="product semi-featured">
        <div class="product-inner">
          <h3>Information</h3>
          <ul>
          	<li><a href="http://www.joomlart.com/blog/news-updates/ja_wall_joomla_responsive_template?utm_campaign=wall&amp;utm_source=demotb" title="Read on blog">Read on blog</a></li>
          	<li><a href="#" id="wall-tour" title="Take the Tour">Take the Tour</a></li>
          	<li><a href="http://www.joomlart.com/joomla/templates/ja-wall" title="Template info">Template info</a></li>
          	<li><a href="http://joomla25-templates.joomlart.com/ja_wall/documentation.html" title="Documentation">Documentation</a></li>
					</ul>
					
					<div class="btn-action-wrap">
						<a class="btn-action btn-buynow" href="https://www.joomlart.com/member/signup.php?type=joomla_single&amp;pid=33&amp;utm_campaign=wall&amp;utm_source=demotb" title="Buy now">Buy now<span><sup>$</sup>49</span></a>
						<span class="msg-direction">Live demo <sup class="notification green">8</sup></span>
					</div>
          
        </div>
      </div>
      <!-- // STATIC SPECIAL CONTENT -->

      <!-- SPECIAL PRODUCTS - Get from database -->
      <?php $cat = 'special';
      if (isset($data[$cat]) && count ($data[$cat])) :
      foreach ($data[$cat] as $product) : ?>
      <div class="product <?php echo $product['tags'] ?> year-<?php echo $product['year'] ?> <?php echo $product['classes'] ?> <?php echo $product['badge'] ?>" data-name="<?php echo $product['name'] ?>" data-url="<?php echo $product['url'] ?>" data-badge="<?php echo $product['badge'] ?>">
        <div class="product-inner">

          <div class="product-image">
            <div class="image-inset">
              <img class="lazy" src="images/products/blank.png" data-original="<?php echo $product['image'] ?>" alt="<?php echo $product['title'] ?>" />
            </div>
          </div>

          <div class="product-info">
            <h3><?php echo $product['title'] ?></h3>
            <?php if (false && $product['downloads']) : ?>
            <div class="product-download" title="Downloads <?php echo number_format($product['downloads']) ?> times">
              <?php echo number_format($product['downloads']) ?>
            </div>
            <?php endif ?>
            <div class="product-desc">
              <p class="date"><?php echo $product['desc'] ?></p>
              <?php if (false && $product['rating']) : ?>
              <div class="rating" title="Rated <?php echo number_format($product['rating'], 1) ?> out of 5 stars">
              <div class="current" style="width: <?php echo $product['rating']*100/5 ?>%;">&nbsp;</div>
              </div>
              <?php endif ?>
            </div>
          </div>

        </div>
      </div>
      <?php endforeach;
      endif; ?>
      <!-- //SPECIAL PRODUCTS -->

    </div>
  </div>
</div>
<!-- // PRODUCTS -->

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
<!-- // PAGINATION -->
