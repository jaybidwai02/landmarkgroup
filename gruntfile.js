module.exports = function(grunt) {

  grunt.initConfig({
    ngtemplates: {
        app: {
            cwd: 'app/',
            src: ['src/view/**/*.html'],
            dest: 'app/src/js/jass/template.js',
            options: {
                htmlmin: {
                    collapseWhitespace: true,
                    collapseBooleanAttribues: true
                },
                bootstrap: function(module, script) {
                    return "angular.module('" + module + "').run(['$templateCache',function($templateCache){" + script + "}]);"
                }
            }
        }
    },
    concat: {
        "lib": {
            "src": [
              "bower_components/angular/angular.js",
              "bower_components/angular-ui-router/release/angular-ui-router.js"
            ],
            "dest": "app/src/js/lib.js"
        },
        "app": {
            "src": [
              "app/src/js/jass/module/validation.js",
              "app/src/js/jass/**/*.js"
            ],
            "dest": "app/src/js/app.js"
        }
    },
    sass: {
        dist: {
          files: {
            'app/src/css/app.css': 'app/src/**/*.scss'
          }
        }
    },
    watch: {
      scripts: {
        files: ['app/src/js/**/*.js'],
        tasks: ['concat'],
        options: {
          spawn: false,
        },
      },
      tmp: {
        files: ['app/src/view/**/*.html'],
        tasks: ['ngtemplates','concat'],
        options: {
          spawn: false,
        },
      },
      sToc:{
        files: ['app/src/**/*.scss'],
        tasks: ['sass'],
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-angular-templates');

  /*grunt.registerTask('watchCss', ['watch:sToc']);
  grunt.registerTask('watchTmp', ['watch:tmp']);
  grunt.registerTask('watchJs', ['watch:scripts']);*/
  grunt.registerTask('watchall', ['watch']);
  grunt.registerTask('default', ['sass','concat']);
  grunt.registerTask('tmp', ['ngtemplates']);

};