import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

//custom style
import customStyle from './customStyle';

export default class Main extends React.Component {
  state = {
    open: false,
    username: "",
    password: "",
    errorMessage: ""
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleLogin = () => {
    if(this.state.username==""){
      this.setState({errorMessage: "Please enter username."});
      this.setState({open: true});
    }else if(this.state.password==""){
      this.setState({errorMessage: "Please enter password."});
      this.setState({open: true});
    }else{
      //check db
      location.href = "top.html";
    }
  };

  setValue= (field, event) => {
    var object = {};
    object[field] = event.target.value;
    this.setState(object);
  };

  render() {
    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ];

    return (
      <MuiThemeProvider>
      <div className="login">
        <div className="login_icon">Cabinet</div>
         <TextField
          hintText="Enter username here..."
          className="login_input"
          underlineStyle={customStyle.underlineStyle}
          value={this.state.username}
          onChange={this.setValue.bind(this, 'username')}
        />
        <TextField
          hintText="Enter password here..."
          type="password"
          className="login_input"
          underlineStyle={customStyle.underlineStyle}
          value={this.state.password}
          onChange={this.setValue.bind(this, 'password')}
        />
        <FlatButton
          label="Login"
          className="login_button"
          onTouchTap={this.handleLogin}
        />
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {this.state.errorMessage}
        </Dialog>

      </div>
      </MuiThemeProvider>
    );
  }
}