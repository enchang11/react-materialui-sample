import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main';
import Top from './Top';

injectTapEventPlugin();

var loginCont = document.getElementById('login');
var topCont = document.getElementById('top');
var dndCont = document.getElementById('dnd');

if(typeof(loginCont) !== 'undefined' && loginCont !== null){
  render(<Main />, document.getElementById('login'));
}
else if(typeof(topCont) !== 'undefined' && topCont !== null){
  render(<Top />, document.getElementById('top'));
}
