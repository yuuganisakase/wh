
var util = require('util'),
    exec = require('child_process').exec,
    exec2 = require('child_process').exec,
    child;
    var os = require('os');
    
child = exec('grunt --no-color',
  function (error, stdout, stderr) {
    //console.log('stdout: ' + stdout);
    //console.log('stderr: ' + stderr);
    if (error !== null) {
      exec2("grunt --no-color qunit | /usr/local/bin/growlnotify -s",function(er, so, se) {
      });
    }
});