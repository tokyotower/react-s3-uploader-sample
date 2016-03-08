'use strict';
const axios = require('axios');
const fileInput = document.querySelector('input[type="file"]');

fileInput.onchange = e => {
  const file = e.target.files[0];
  axios.get('/upload', {
    params: {
      filename: file.name,
      filetype: file.type
    }
  }).then(res => {
    const options = {
      headers: {
        'Content-Type': file.type
      }
    };
    return axios.put(res.data.url, file, options);
  }).then(res => {
    console.log(res.config);
  }).catch(res => {
    console.log(res);
  });
};
