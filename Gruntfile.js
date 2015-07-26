module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      build: {
        options: {
          browserifyOptions: {
            debug: true,
            transform: ['reactify'],
            extensions: ['.jsx']
          }
        },
        files: {
          'server/public/scripts.js': 'client/entrypoint.jsx'
        }
      }
    },
    watch: {
      build: {
        files: ['client/**/*'],
        tasks: ['build']
      }
    },
    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('build',['browserify:build']);
  grunt.registerTask('serve',['nodemon']);
};
