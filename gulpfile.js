const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');

gulp.task('test', (cb) => {
    gulp.src(['./lib/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', () => {
            gulp.src(['./lib/__tests__/*.js'])
                .pipe(mocha({ reporter: 'nyan' }))
                .pipe(istanbul.writeReports())
                .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
                .on('end', cb);
        });
});
