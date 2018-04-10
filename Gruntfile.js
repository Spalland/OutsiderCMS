module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: false
      },
      files: {
	    expand: true,
	    cwd: 'public/src/',
        src: [	'lib/*.js',
        		'lib/_bower/*.js',
        		'app/**/*.js'],
        dest: 'public/dist/', 
        ext: '.min.js'
      }
    },
    cssmin: {
	  target: {
	    files: [{
	      expand: true,
	      cwd: 'public/src/css',
	      src: ['*.css', '!*.min.css'],
	      dest: 'public/dist/css',
	      ext: '.min.css'
	    }]
	  }
	},
	jshint: {
    	all: ['Gruntfile.js', 'app/**/*.js'],
    	options: {
	      curly: true,
	      eqeqeq: true,
	      eqnull: true,
	      browser: true,
	      node: true,
	      globals: {
	        module: false
	        
	      }
	   }
	}, 
	bower_concat: {
		all : {
			dest : "public/src/lib/dependencies.js",
			include: ['angular', 'angular-route', 'angular-animate', 'ng-file-upload', 'ngstorage'],
			dependencies: {
				'ng-file-upload': 'angular',
				'ngstorage': 'angular'
				
        	}
		} 
	}
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bower-concat');

  // Default task(s).
  grunt.registerTask('default', ['cssmin', 'jshint', 'bower_concat', 'uglify']);

};