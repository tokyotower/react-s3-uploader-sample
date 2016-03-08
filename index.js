'use strict';
import React, {Component} from 'react';
import {render} from 'react-dom';
import Dropzone from 'react-dropzone';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {files: []};
    this.handleOnDrop = this.handleOnDrop.bind(this);
  }

  handleOnDrop(files) {
    this.setState({files});
    upload(files);
  }

  render() {
    return (
      <div>
        <Dropzone onDrop={this.handleOnDrop} accept="image/*">
          <div>ここにファイルをドラックまたはクリックしてファイルを選んでください</div>
        </Dropzone>
        {this.state.files.length > 0 ?
          <div>
            <h2>{this.state.files.length}件のファイルをアップロードしています</h2>
            <div>
              {this.state.files.map(({name, preview}) =>
                <img key={name} src={preview} style={{width: '200px', height: '200px'}}/>)}
            </div>
          </div> : null}
      </div>
    );
  }
}

render(
  <App/>,
  document.querySelector('#main')
);

const axios = require('axios');

function upload(files) {
  const file = files[0];
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
}
