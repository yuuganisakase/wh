/*global module:false*/
module.exports = function(grunt) {
  
  var exec = require('child_process').exec;
  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
        src: [
        'src/js/util/ViewFactory.js',
        'src/js/model/nodeModel.js',
        'src/js/model/nodeList.js',
        'src/js/view/nodeView.js',
        'src/js/view/headerView.js',
        'src/js/util/loadCommand.js',
        'src/js/util/DrawLinkCommand.js',
        'src/js/util/ArrangeNodeCommand.js',
        'src/js/util/GetGroupMembersCommand.js',
        'src/js/util/FindNonFriendFromArrayCommand.js',
        'src/js/util/FBproxy.js',
        'src/js/app2.js'
        ],
        dest: 'src/js/app.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    lint: {
      files: ['grunt.js','src/index.html',  'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'qunit copy'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'concat qunit');
  grunt.registerTask('copy', 'copy copy copy', function() {
      var done = this.async();
      exec('cp -rfp ' + 'src/ ' + '/Library/WebServer/Documents/src/' , function(error, stdout, stderr){
        if(error) console.log(error);

        done(true);
      });
      

      //grunt.file.copy('src', "/Library/WebServer/Documents");
  });

};
