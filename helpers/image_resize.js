/**
 * Created by pedi on 9/4/15.
 */
// credits to http://blog.ragingflame.co.za/2015/2/6/resizing-images-in-nodejs-applications
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');
var rename = require("gulp-rename");

function processImg (filesrc) {
    return gulp.src(filesrc)
        // compress and save
        .pipe(imagemin({optimizationLevel: 6}))
        .pipe(imageResize({
            width: 960
        }))
        .pipe(gulp.dest('images/'))
        .pipe(imageResize({
            width: 320
        }))
        .pipe(rename(function (path) {
          path.basename += "_thumbnail";
        }))
        .pipe(gulp.dest('images/'));
}

process.on('message', function (images) {
    console.log('Image processing started...');
    var stream = processImg(images);
    stream.on('end', function () {
        process.send('Image processing complete');
        process.exit();
    });
    stream.on('error', function (err) {
        process.send(err);
        process.exit(1);
    });
});
module.exports = {};