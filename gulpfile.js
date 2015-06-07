var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

gulp.task('test', function (cb) {

    gulp.src(['./lib/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function () {
            gulp.src(['./lib/__tests__/*.js'])
                .pipe(mocha({reporter: 'nyan'}))
                .pipe(istanbul.writeReports()) // Creating the reports after tests runned
                .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } })) // Enforce a coverage of at least 90%
                .on('end', cb);
        });
});
