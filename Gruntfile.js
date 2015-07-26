module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      build: {
        options: {
          debug: true,
          transform: ['reactify']
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('build',['browserify:build']);
};
