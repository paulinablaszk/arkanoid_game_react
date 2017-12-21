var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var bs = require("browser-sync").create();
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');


var handleError = function(err) {
    console.log(gutil.colors.red(err.toString()));
    this.emit("end");
}

gulp.task("browseSync", function() {
    bs.init({
        server: ".",
        notify: false,
        //host: "192.168.0.24", //ipconfig -> IPv4 Address Wirless LAN adapter WiFi from ipconfig
        //port: 3000,
        open: true //czy otwierac strone
    });
});

gulp.task('sass', function () {
    return gulp.src('./src/scss/style.scss')
        .pipe(plumber({
            errorHandler : handleError
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "compressed" //nested, expanded, compact, compressed
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        })) //autoprefixy https://github.com/postcss/autoprefixer#browsers
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css'))
        .pipe(bs.stream({match: "**/*.css"}));
});


gulp.task('watch', function () {
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./*.html').on("change", bs.reload);
});


gulp.task('default', function() {
    console.log(gutil.colors.yellow('========== rozpoczynam pracę =========='));
    gulp.start(['browseSync', 'sass', 'watch']);
})