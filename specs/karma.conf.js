module.exports = function(config) {
  config.set({
	basePath: '../js',
	  
    frameworks: ['jasmine'],
 
	browsers : ['Chrome'],

    files: [
      '*.js'
    ]
  });
};