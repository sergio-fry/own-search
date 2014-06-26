(function($) {


  var Worker = function() {
    this.jobs = [];
  }

  // var worker = new Worker();
  // worker.add_job(function(callback) {
  //   // do the job
  //   callback();
  // });
  //
  // worker.work();
  Worker.prototype.add_job = function(job) {
    this.jobs.push(job);
  }

  // callback после выполнения всех задач
  Worker.prototype.work = function(callback) {
    var job = this.jobs.shift();
    var worker = this;

    if(!!job) {
      this.do_the_job(job, function() {
        worker.work(callback)
      });
    } else {
      (callback || $.noop)();
    }
  }

  Worker.prototype.do_the_job = function(job, callback) {
    job(callback);
  }

  Worker.prototype.idle = function() {
    return this.jobs.length == 0;
  }







  var rca_key = "rca.1.1.20140616T090842Z.b9ca0702ee2f2238.f836b29417365b90f345c0686a50313b70863e1a";

  var rca_fetch_page = function(url) {
    return $.getJSON("http://rca.yandex.com/?key=" + rca_key + "&url=" + encodeURIComponent(url));
  }

  var ERROR = -1;
  var READY = 0;
  var EMPTY = 1;
  var INDEXINX = 2;

  var Search = window.sp_Poisk = function(options) {
    this.sitemap_url = options.sitemap_url || ("//"+window.location.host+"/sitemap.xml");

    this.$el = $(options.el);
    this.$results = this.$el.find(".sp-results");
    this.$status = this.$el.find(".sp-status");

    this.pages = [];
    this.urls = [];

    this.workers = [];
      
    for(var i=0; i < 10; i++) {
      this.workers.push(new Worker());
    }

    this.set_status(EMPTY);

    this.build_index();
  };


  Search.prototype.set_status = function(status) {
    this.status = status;
    this.display_status();
  }

  Search.prototype.display_status = function() {
    var result;

    switch(this.status) {
      case ERROR: result = "Ошибка: " + this.error; break;
      case READY: result = ""; break;
      case EMPTY: result = "индекс пуст"; break;
      case INDEXINX:
        result = "Страниц проиндексировано: " + this.pages.length + " из " + this.urls.length;
      break;
      default:
        result = "Незвестная ошибка";
    }

    this.$status.text(result);
  }

  Search.prototype.fetch_urls_from_sitemap = function(sitemap_url) {
    var search = this;

    return $.get("http://json-curl.herokuapp.com/ba-simple-proxy.php?url="+encodeURIComponent(sitemap_url.trim()), function(data) {
      
      search.urls = $.makeArray($(data.contents).find("url loc").map(function(i, el) {
        return $(el).text();
      }));
    }, "jsonp").fail(function() {
      this.status = ERROR;
      this.error = "Не удалось загрузить sitemap.xml";
    });
  }

  Search.prototype.workers_idling = function() {
  }

  Search.prototype.build_index = function() {
    var search = this;

    search.set_status(INDEXINX);

    return this.fetch_urls_from_sitemap(this.sitemap_url).always(function() {
      search.pages = [];

      search.urls.map(function(url, i) {
        search.workers[i % search.workers.length].add_job(function(callback) {
          rca_fetch_page(url.trim()).done(function(data) {
            search.pages.push(data);
            search.display_status();
          }).always(callback);
        })
      });

      search.workers.map(function(worker) {
        worker.work(function() {
          var worker_statuses = search.workers.map(function(worker) {
            return worker.idle();
          });

          if(worker_statuses.indexOf(false) == -1) {
            if(search.pages.length > 0) {
              search.set_status(READY);
            } else {
              search.set_status(EMPTY);
            }
          }
        })
      });
    });
  }

  Search.prototype.page_to_html = function(page) {
    return "<strong><a href='"+page.url+"'>"+page.title+"</a></strong><br />"+page.content+"";
  }

  Search.prototype.find = function(q) {
    var search = this;

    html = "";
  
    if(!!q) { // если запрос не пустой
      matched = this.pages.reduce(function(result, el) {
        var text = el.title + el.content;
        if(text.toLowerCase().search(q.toLowerCase()) != -1) {
          result.push(el);
        }

        return result;
      }, []);

      html = matched.slice(0, 9).map(function(el) {
        return "<li>"+search.page_to_html(el)+"</li>";
      }).join("");

      html = "<ol>"+html+"</ol>";

      if(matched.length > 10) {
        html += "<p>...и еще "+(matched.length - 10)+" результатов</p>";
      }
    } else {
      results = "Введите поисковый запрос";
    }

    this.$results.html(html);
  }
})(jQuery);
