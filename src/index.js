import '@babel/polyfill';

import React, { Component } from 'react';
import ReactDome from 'react-dom';

class App extends Component {
  render() {
    return (
      <div>Hello World!</div>
    )
  }
}

ReactDome.render(<App/>, document.getElementById('root'));
