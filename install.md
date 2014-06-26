---
layout: page
title: Установка поиск на сайт
permalink: /install/
---

## Код для вставки

Замените SITEMAP_URL на URL sitemap.xml для Вашего сайта. Вставьте код там, где должен отображаться поиск.

{% highlight html %}
<div id="sp-search">
  <h1>Поиск по сайту</h1>
  <input type="text" class="sp-query" placeholder="введите поисковый зпрос" value="" /> <input type="submit" value="Найти" class="sp-find-button" />
  <span class="sp-status"></span>
  <br />
  <span class="sp-results"></span>
</div>

<script type="text/javascript" src="http://yandex.st/jquery/2.1.1/jquery.min.js"></script>
<script type="text/javascript" src="http://svoy-poisk.sergei-udalov.ru/js/search.js"></script>

<script type="text/javascript">
  var search;

  search = new sp_Poisk({ sitemap_url: "SITEMAP_URL", el: "#sp-search" });

  jQuery("#sp-search .sp-find-button").click(function() {
    var q = jQuery("#sp-search .sp-query").val();
    search.find(q);
  });

</script>
{% endhighlight %}


## Попробуйте поиск прямо сейчас

Введите URL sitemap.xml Вашего сайта:

<div id="sitemap">
  <input type="text" class="sitemap" size="40"/> <input type="submit" value="создать поиск" />
  <span class="status"></span>
</div>

<div id="search-example" style="display: none">
  <div id="sp-search">
    Поиск: <br /><input type="text" class="sp-query" placeholder="введите поисковый зпрос" value="" /> <input type="submit" value="Найти" class="sp-find-button" />
    <span class="sp-status"></span>
    <br />
    <span class="sp-results"></span>
  </div>
</div>


<script type="text/javascript" src="/js/jquery.min.js"></script>
<script type="text/javascript" src="/js/search.js"></script>

<script type="text/javascript">
  var search;

  $("#sitemap .sitemap").val("").change(function() {
    if($(this).val().trim() != "") {
      search = new sp_Poisk({ sitemap_url: $(this).val(), el: "#sp-search" });
      $("#search-example").show();
      $("#sitemap .status").text("");
    } else {
      $("#sitemap .status").text("Введите адрес sitemap.xml");
      $("#search-example").hide();
    }
  });

  $("#sp-search .sp-find-button").click(function() {
    var q = $("#sp-search .sp-query").val();
    search.find(q);
  });
</script>
