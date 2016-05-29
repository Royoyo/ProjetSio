var gulp = require("gulp"),
    inject = require("gulp-inject"),
    concat = require("gulp-concat"),
    series = require("stream-series"),
    replace = require("gulp-replace");

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
    
    //Partie webApp
    gulp.src("./webApp/scripts/**/*.js")
        .pipe(concat("app.js"))
        .pipe(gulp.dest("./webApp"));
    
    //Partie electron
    gulp.src("./webApp/app.js")
        .pipe(replace("./backend/","http://gpci.guillaumehaag.fr/backend/"))
        .pipe(gulp.dest("./electronApp/app/"));
    gulp.src("./webApp/views/**/*.html")
        .pipe(gulp.dest("./electronApp/app/views/"));
    gulp.src("./webApp/modals/**/*.html")
        .pipe(gulp.dest("./electronApp/app/modals/"));
});