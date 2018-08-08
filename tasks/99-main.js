const gulp = require('gulp')

gulp.task('build', gulp.parallel(
  'licenses',
  'static:prod',
  'static:copy',
  'static:email',
  'static:sitemap',
  'static:email-templates',
))

gulp.task('api:fast', gulp.parallel(
  'licenses',
  'static:email',
  'static:email-templates',
))

gulp.task('client:watch', gulp.parallel(
  'static:fast',
  'static:copy',
  'static:sitemap',
  'static:watch',
))
