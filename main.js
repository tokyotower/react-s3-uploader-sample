'use strict';
const Express = require('express');
const app = new Express();
const port = 3000;

app.use(Express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/upload', (req, res) => {
  upload(req.query).then(url => {
    res.json({url: url});
  }).catch(e => {
    console.log(e);
  });
});

app.listen(port, error => {
  if (error) {
    console.error(error);
  } else {
    console.info('listen: ', port);
  }
});

const aws = require('aws-sdk');
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const BUCKET = process.env.BUCKET;

aws.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY
});

function upload(file) {
  const s3 = new aws.S3();
  const params = {
    Bucket: BUCKET,
    Key: file.filename,
    Expires: 60,
    ContentType: file.filetype
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        reject(err);
      }
      resolve(url);
    });
  });
}
