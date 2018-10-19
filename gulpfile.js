const gulp = require('gulp')

gulp.task('default', function () {
  gulp.src('./libe-tools-front/build/**')
    .pipe(gulp.dest('./libe-tools-back/client'))
})
