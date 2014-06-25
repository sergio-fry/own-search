(function() {
  var Worker = window.Worker = function() {
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

  Worker.prototype.work = function(job) {
    var job = this.jobs.shift();
    var worker = this;

    if(!!job) {
      this.do_the_job(job, function() {
        worker.work()
      });
    }
  }

  Worker.prototype.do_the_job = function(job, callback) {
    job(callback);
  }
})();
