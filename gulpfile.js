let gulp = require('gulp');
let concatCss = require('gulp-concat-css'); // Конкатинация файлов CSS (их склеивание)
let cleanCSS = require('gulp-clean-css'); // Минификация css файлов
let includer = require('gulp-htmlincluder'); // Конкатинация файлов HTML (их склеивание)
let connect = require('gulp-connect'); // Сервер
let livereload = require('gulp-livereload'); // Livereload
let replace = require('gulp-html-replace');
let spritecreator = require('gulp.spritesmith');

// Создание спрайтов
gulp.task('sprite', async function(){
	var spriteData = gulp.src('dev/img/icons/*.png')
						.pipe(spritecreator({
							imgName: 'sprite.png',
							cssName: 'sprite.css',
							algorithm: 'binary-tree'
						}));
	spriteData.img.pipe(gulp.dest('build/img/'));
	spriteData.css.pipe(gulp.dest('build/css/'));
});

// Конкатинация файлов CSS (их склеивание)
gulp.task('concat', async function(){
	return gulp.src(['dev/css/reset.css', 'dev/css/**/*.css'])
	.pipe(concatCss("style.css"))
	.pipe(cleanCSS({compatibility: 'ie8'})) // Минификация css файлов
	.pipe(gulp.dest('build/css/'))
	.pipe(connect.reload());
});

// Конкатинация файлов HTML (их склеивание)
gulp.task('html', async function() {
   return gulp.src('dev/**/*.html')
   .pipe(includer())
   .pipe(replace({
   	css: 'css/style.css'
   }))
   .pipe(gulp.dest('build/'))
   .pipe(connect.reload());
});

// Виртуальный сервер Livereload
gulp.task('connect', async function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});

// Просмоторшик
async function watch() {
	gulp.watch('dev/**/*.html', gulp.series('html'));
	gulp.watch('dev/**/*.css', gulp.series('concat'));
}

// Комплексный запуск
gulp.task('default', gulp.series('connect', 'html', 'concat', watch));


	