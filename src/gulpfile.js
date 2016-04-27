var gulp = require("gulp"),
    inject = require("gulp-inject"),
    concat = require("gulp-concat"),
    series = require("stream-series"),
    ngAnnotate = require("ng-annotate"),
    uglify = require("gulp-uglify");

gulp.task("injectScripts", function() {
    var base = gulp.src(["./wwwroot/scripts/*.js"], {read: false});
    var services = gulp.src(["./wwwroot/scripts/services/**/*.js"], {read: false});
    var directives = gulp.src(["./wwwroot/scripts/directives/*.js"], {read: false});
    var filters = gulp.src(["./wwwroot/scripts/filters/*.js"], {read: false});
    var controllers = gulp.src(["./wwwroot/scripts/controllers/**/*.js"], {read: false});
                
    gulp.src("./wwwroot/index.html")
        .pipe(inject(series(base, services, directives, filters, controllers), { relative: true })
             )
        .pipe(gulp.dest("./wwwroot"));
}); 


gulp.task("deployProd", function() {
    return gulp.src("./wwwroot/scripts/**/*.js")
    .pipe(concat("app.js"))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest("./wwwroot"));
});