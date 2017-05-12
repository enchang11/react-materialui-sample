import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main'; // Our custom react component
import Top from './Top'; // Our custom react component


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Render the main app react component into the app div.
// For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
var loginCont = document.getElementById('login');
var topCont = document.getElementById('top');
var dndCont = document.getElementById('dnd');

if(typeof(loginCont) !== 'undefined' && loginCont !== null){
  render(<Main />, document.getElementById('login'));
}
else if(typeof(topCont) !== 'undefined' && topCont !== null){
  render(<Top />, document.getElementById('top'));
}
