import polyfill from 'babel-polyfill'; // eslint-disable-line no-unused-vars
import path from 'path';
import fs from 'fs-extra';
import gulp from 'gulp';
import psd from 'psd';
import glob from 'glob';

const src = path.resolve('./1-from');
const dist = path.resolve('./2-to');

gulp.task('default', cb => {
  glob(path.join(src, '**', '*.psd'), (err, matches) => {
    if (err) {
      cb(err);
    } else {
      matches.reduce((promise, psdPath) => {
        return promise.then(() => psdToPng(psdPath));
      }, Promise.resolve())
      .then(() => cb())
      .catch(e => cb(e));
    }
  })
});

function psdToPng(psdPath) {
  const distPath = psdPath.replace(src, dist).replace(/\.psd$/, '.png');
  const distDir = path.dirname(distPath);
  fs.ensureDirSync(distDir);
  return psd.open(psdPath).then(psdObj => {
    return psdObj.image.saveAsPng(distPath);
  }).then(() => {
    console.log('[Finished]', distPath);
  });
}
