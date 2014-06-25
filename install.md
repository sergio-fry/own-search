---
layout: page
title: Установка поиск на сайт
permalink: /install/
---

  1. Список страниц
  2. Попробуйте поиск
  3. Загрузите own_search_data.json на сервер
  4. Укажите URL, по которому доступен own_search_data.json
  5. Установите год на свой сайт

## 1. Список страниц

Введите URL sitemap.xml Вашего сайта:

<input type="text" id="sitemap" size="40"/>

Список страниц, которые попадут в поиск:

<textarea id="urls" cols="80" rows="20"></textarea>

*каждый URL на новой строке*

## 2. Попробуйте поиск

<input type="text" id="search" /> <input type="submit" value="Найти" />
(<span id="status">пока страниц нет</span>)
<br />
<span id="search_results">Введите поисковый запрос</span>

<script type="text/javascript" src="/js/jquery.min.js"></script>
<script type="text/javascript" src="/js/worker.js"></script>

<script type="text/javascript">
  var rca_key = "rca.1.1.20140616T090842Z.b9ca0702ee2f2238.f836b29417365b90f345c0686a50313b70863e1a";

  var rca_fetch_page = function(url) {
    return $.getJSON("http://rca.yandex.com/?key=" + rca_key + "&url=" + encodeURIComponent(url));
  }

  var pages = [];
  var urls = [];

  var fetch_urls_from_sitemap = function(sitemap_url) {
    return $.get("http://json-curl.herokuapp.com/ba-simple-proxy.php?url="+encodeURIComponent(sitemap_url.trim()), function(data) {
      
      urls = $(data.contents).find("url loc").map(function(i, el) {
        return $(el).text();
      });

      $("#urls").val($.makeArray(urls).join("\n")).trigger("change");

    }, "jsonp");
  }

  $("#sitemap").val("").change(function() {
    var loader = $("<img src='/img/loader.gif' />");
    $("#sitemap").after(loader);

    fetch_urls_from_sitemap($(this).val()).always(function() {
      loader.remove();
    });;
  });
  

  var display_status = function() {
    $("#status").text("Страниц проиндексировано: " + pages.length + " из " + urls.length);
  }

  $("#urls").val("").change(function() {
    pages = [];

    display_status();

    var workers = [];
    
    for(var i=0; i < 10; i++) {
      workers.push(new Worker());
    }

    $("#urls").val().split(/\s/).map(function(url, i) {
      workers[i % workers.length].add_job(function(callback) {
        rca_fetch_page(url.trim()).done(function(data) {
          pages.push(data);
          display_status();
        }).always(callback);
      })
    });

    workers.map(function(worker) { worker.work() });

  }).trigger("change");

  $("#search").keyup(function() {
    var q = $(this).val();

    html = "";

  
    if(!!q) { // если запрос не пустой
      matched = pages.reduce(function(result, el) {
        var text = el.title + el.content;
        if(text.toLowerCase().search(q.toLowerCase()) != -1) {
          result.push(el);
        }

        return result;
      }, []);

      html = matched.slice(0, 9).map(function(el) {
        return "<li><p><strong><a href='"+el.url+"'>"+el.title+"</a></strong><br />"+el.content+"</p></li>";
      }).join("");

      html = "<ol>"+html+"</ol>";

      if(matched.length > 10) {
        html += "<p>...и еще "+(matched.length - 10)+" результатов</p>";
      }


    } else {
      results = "Введите поисковый запрос";
    }

    $("#search_results").html(html);
  });

</script>
