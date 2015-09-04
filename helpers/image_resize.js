/**
 * Created by pedi on 9/4/15.
 */
// credits to http://blog.ragingflame.co.za/2015/2/6/resizing-images-in-nodejs-applications
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');

function processImg (filesrc) {
    return gulp.src(filesrc)
        // compress and save
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(imageResize({
            width: 960
        }))
        .pipe(gulp.dest('images/960'))
        .pipe(imageResize({
            width: 320,
            height: 320,
            crop: true
        }))
        .pipe(gulp.dest('images/320'))
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