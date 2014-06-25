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

Укажите список страниц, которые попадут в поиск

<textarea id="urls" cols="80" rows="20"></textarea>

*каждый URL на новой строке*

## 2. Попробуйте поиск

<input type="text" id="search" /> <input type="submit" value="Найти" />
<br />
<span id="search_results">Введите поисковый запрос</span>

<script type="text/javascript" src="/js/zepto.min.js"></script>

<script type="text/javascript">
  var rca_key = "rca.1.1.20140616T090842Z.b9ca0702ee2f2238.f836b29417365b90f345c0686a50313b70863e1a";

  var rca_fetch_page = function(url, callback) {
    $.getJSON("http://rca.yandex.com/?key=" + rca_key + "&url=" + url, callback);
  }

  var pages = [];

  $("#urls").change(function() {
    pages = [];

    $("#urls").val().split(/\s/).map(function(url) {
      rca_fetch_page(url, function(data) {
        pages.push(data);
      });
    });
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
