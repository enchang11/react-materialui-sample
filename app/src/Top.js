import React from 'react';
import ReactDOM from 'react-dom';

//Material Ui Components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {darkBlack, white, green900, red} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

//icons
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import ActionHistory from 'material-ui/svg-icons/action/history';
import ActionFace from 'material-ui/svg-icons/action/face';
import DeviceStorage from 'material-ui/svg-icons/device/storage';
import Add from 'material-ui/svg-icons/content/add';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';

//use to CRUD data in database
import axios from 'axios';

//custom style
import customStyle from './customStyle';

class Top extends React.Component {

  state = {
    memberListingOpen: false,
    open: false,
    historyOpen: false,
    searchOpen: false,
    filesOpen: false,
    cabinetOpen: false,
    cDelOpen: false,
    message: "",
    msgClass: "",
    searchKey: "",
    member: {
      member_id: "",
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      userType: 1
    },
    members: [],
    member_mode: "",
    memberDelID: "",
    files: {
      name: "",
      category: 1,
      description: "",
    },
    fileDelID: "",
    documents: [],
    cabinets: [],
    cabDelID: "",
    cabinet: {
      c_id: "",
      cabinet_code: "",
      level_num: "",
      locked: false,
      short_desc: "",
    },
    cabinet_mode: "",
    cDelType: ""
  };

  //search=====================
  handleSearch = () => {
    console.log(this.state.searchKey);
  };
  //===========================

  //member ====================
  getMemberListing = () => {
    //get member listing
    axios.get('/api/1.0/members')
    .then(res => {
      this.setState({ members: res.data });
    });
  };

  regMember = () => {
    var _this = this;
    var member = this.state.member;
    var memberAPI = "";
    if(member.name==""){
      this.setState({message: "Please fill up member name"});
      this.setState({msgClass: "errorMsg"});
    }
    else{
      if(this.state.member_mode!="edit"){
        memberAPI = '/api/1.0/add_member';
      }
      else{
        memberAPI = '/api/1.0/update_member';
      }
      axios.post(memberAPI, member)
      .then(function(res){
        _this.setState({
            member: {
              name: "",
              email: "",
              username: "",
              password: "",
              confirmPassword: "",
              userType: 1
            }
          });

        _this.setState({message: "Saved successfully"});
        _this.setState({msgClass: "successMsg"});

        setTimeout(function() { 
          _this.setState({message: "", msgClass:"" });
          if(this.state.member_mode=="edit"){
            _this.handleDialog('open', false);
            _this.handleDialog('memberListingOpen', true);
          }
        }.bind(_this), 2000);

        _this.getMemberListing();
      });
    }
  };

  delMember = (id, event) => {
    this.setState({memberDelID: id, cDelType: 'member'});
    this.handleDialog('cDelOpen', true);
  };

  editMember = (id, event) => {
    var _this = this;
    axios.post('/api/1.0/edit_member', {id: id})
    .then(function(res){
      _this.setState({
            member: {
              member_id: res.data[0].member_id,
              name: res.data[0].name,
              email: res.data[0].email,
              username: res.data[0].username,
              password: res.data[0].password,
              confirmPassword: res.data[0].password,
              userType: res.data[0].user_level
            }
          });
      _this.handleDialog('open', true);
      _this.setState({member_mode: "edit"});
    });  
  };
  //===========================

  //files =====================
  getContentListing = () => {
    //get files/content
    axios.get('/api/1.0/content')
    .then(res => {
      this.setState({ documents: res.data });
    });
  };

  addFiles = () => {
    var _this = this;
    var files = this.state.files;
    axios.post('/api/1.0/add_files', files)
      .then(function(res){
        _this.setState({
          files:{
            name: "",
            category: 1,
            description: "",
          }
        });

        _this.setState({message: "Saved successfully"});
        _this.setState({msgClass: "successMsg"});
      });

      setTimeout(function() { 
        _this.setState({message: "", msgClass:"" });
      }.bind(_this), 2000);

    _this.getContentListing();
  };

  deleteFiles = (id, event) => {
    this.setState({fileDelID: id, cDelType: 'files'});
    this.handleDialog('cDelOpen', true);
  };
  //===========================

  //cabinet ===================
  getCabinetListing = () => {
    axios.get('/api/1.0/cabinets')
    .then(res => {
      this.setState({ cabinets: res.data });
    });
  };

  //loop cabinet level
  loopLevel = (count, event) => {
    var lis = [];
    for(var i = 0; i < count; i++){
      lis.push(
        <li key={i} style={{height: 304/count}}>
          <ul style={{height: 304/count}}>
            <li>Leave Form</li>
            <li>Leave Form</li>
            <li>Leave Form</li>
            <li>Leave Form</li>
            <li>Leave Form</li>
          </ul>
        </li>
        );
    }
    return lis;
  };

  //delete cabinet
  delCabinet = (id, event) => {
    this.setState({cabDelID: id, cDelType: 'cabinet'});
    this.handleDialog('cDelOpen', true);
  };

  //add cabinet
  addCabinet = () => {
    var _this = this;
    var cabinet = this.state.cabinet;
    var cabinetAPI = "";
    if(this.state.cabinet_mode!="edit"){
      cabinetAPI = '/api/1.0/add_cabinet';
    }
    else{
      cabinetAPI = '/api/1.0/update_cabinet';
    }
    axios.post(cabinetAPI, cabinet)
      .then(function(res){
        _this.setState({
          cabinet: {
            cabinet_code: "",
            level_num: "",
            locked: false,
            short_desc: "",
          }
        });

        _this.setState({message: "Saved successfully"});
        _this.setState({msgClass: "successMsg"});
      });

      setTimeout(function() { 
        _this.setState({message: "", msgClass:"" });
        if(this.state.cabinet_mode=="edit"){
          _this.handleDialog('cabinetOpen', false);
        }
      }.bind(_this), 2000);

    _this.getCabinetListing();
  };

  editCabinet = (id, event) => {
    var _this = this;
    axios.post('/api/1.0/edit_cabinet', {id: id})
    .then(function(res){
      _this.setState({
            cabinet: {
              c_id: res.data[0].c_id,
              cabinet_code: res.data[0].cabinet_code,
              level_num: res.data[0].level_num,
              locked: res.data[0].locked,
              short_desc: res.data[0].short_desc
            }
          });
      _this.handleDialog('cabinetOpen', true);
      _this.setState({cabinet_mode: "edit"});
    });  
  };
  //===========================

  //===========================
  componentDidMount = () => {
    this.getContentListing();
    this.getMemberListing();
    this.getCabinetListing();
  };
  
  handleDialog = (field, open, event) => {
    if(open){
      var object = {};
      object[field] = true;
      this.setState(object);
    }else{
      var object = {};
      object[field] = false;
      this.setState(object);
      if(field=="open"){
        this.setState({
          open: false,
          member: {
            member_id: "",
            name: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            userType: 1
          },
          msgClass: "",
          message: ""
        });
      }
    }
  };

  //set value of each text field
  setValue = (parent, field, event) => {
    var object = {}
    if(parent != ""){
      this.state[parent][field] = event.target.value;
      this.forceUpdate();
    }else{
      object[field] = event.target.value;
      this.setState(object);
    }
  };

  //change of select field
  handleChange = (event, index, value) => {
    this.state.member['userType'] = value;
    this.state.files['category'] = value;
    this.forceUpdate();
  };

  //check/uncheck checkbox
  handleCheck = (event,checked) => {
    this.state.cabinet['locked'] = checked;
    this.forceUpdate();
  };

  confirmDelete = () => {
    var cDelType = this.state.cDelType;
    var _this = this;
    var id = "";
    var api = "";
    var func = ""
    if(cDelType=="files"){
      id = this.state.fileDelID;
      api = '/api/1.0/del_file';
      func = _this.getContentListing();
    }
    else if(cDelType=="member"){
      id = this.state.memberDelID;
      api = '/api/1.0/del_member';
      func = _this.getMemberListing();
    }
    else if(cDelType=="cabinet"){
      id = this.state.cabDelID;
      api = '/api/1.0/del_cabinet';
      func = _this.getCabinetListing();
    }

    axios.post(api, {id: id})
      .then(function(res){
        func;
        _this.handleDialog('cDelOpen', false);
      }); 
  };
  //===========================

  render() {
    //header right links
    const rightButtons = (
      <div style={{marginTop: '7px'}}>
        <TextField
          name="searchKey"
          value={this.state.searchKey}
          onChange={this.setValue.bind(this, '', 'searchKey')}
          className="searchInput"
          underlineShow={false}
          hintText="Search here..."
          hintStyle={customStyle.hintStyle}
          inputStyle={customStyle.inputStyle}
        />
        <FlatButton 
          backgroundColor="#434857"
          icon={<ActionSearch color={white}/>}
          className="searchBtn"
        />

        <IconMenu
          iconButtonElement={
            <FlatButton
              label="Members"
              labelStyle={{color: white}}
              icon={<ActionAccountCircle color={white}/>}
            />
          }
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
          <MenuItem primaryText="Members" onTouchTap={this.handleDialog.bind(this, 'memberListingOpen', true)}/>
          <MenuItem primaryText="Add Member" onTouchTap={this.handleDialog.bind(this, 'open', true)}/>
        </IconMenu>

        <FlatButton
          label="History"
          labelStyle={{color: white}}
          onTouchTap={this.handleDialog.bind(this, 'historyOpen', true)}
          icon={<ActionHistory color={white}/>}
        />

        <FlatButton
          href="index.html"
          label="Logout"
          labelPosition="after"
          labelStyle={{color: white}}
          icon={<ActionFace color={white}/>}
        />
      </div>
    );

    //member registration dialog action button
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleDialog.bind(this, 'open', false)}
        className="grey_btn"
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.regMember}
        className="green_btn"
      />,
    ];

    //member listing dialog action button
    const memberActions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleDialog.bind(this, 'memberListingOpen', false)}
        className="grey_btn"
      />,
      <FlatButton
        label="New"
        secondary={true}
        onTouchTap={this.handleDialog.bind(this, 'open',true)}
        className="green_btn"
      />
    ];

    //history dialog action button
    const historyActions = [
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleDialog.bind(this, 'historyOpen', false)}
        className="green_btn"
      />
    ];

    //files dialog action button
    const fileActions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleDialog.bind(this, 'filesOpen', false)}
        className="grey_btn"
      />,
      <FlatButton
        label="Submit"
        secondary={true}
        onTouchTap={this.addFiles}
        className="green_btn"
      />
    ];

    //cabinet dialog action button
    const cabinetActions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleDialog.bind(this, 'cabinetOpen', false)}
        className="grey_btn"
      />,
      <FlatButton
        label="Submit"
        secondary={true}
        onTouchTap={this.addCabinet}
        className="green_btn"
      />
    ];

    //confirm delete dialog action buttons
    const cDelAction = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleDialog.bind(this, 'cDelOpen', false)}
        className="grey_btn"
      />,
      <FlatButton
        label="Delete"
        secondary={true}
        onTouchTap={this.confirmDelete}
        className="green_btn"
      />
    ];

    return (
      <MuiThemeProvider>
       <div>
         {/* Header */}
         <AppBar
         style={customStyle.appBarStyle}
         title="Cabinet"
         iconElementRight={rightButtons}
         iconElementLeft={<IconButton><DeviceStorage /></IconButton>}
         />

        {/*Cabinet*/}
        <div>
          <Paper className="list" style={{height: document.documentElement.clientHeight}}>
            <FlatButton
              label="Add File"
              labelStyle={{color: white}}
              backgroundColor="#91A30E"
              hoverColor="#73820B"
              icon={<Add color={white}/>}
              className="addDoc"
              onTouchTap={this.handleDialog.bind(this, 'filesOpen', true)}
            />
            <h2>List</h2>
            <br/><br/>
            <Divider />
            <br/>
            <List>
              {this.state.documents.map((document, index)  =>
                <ListItem 
                  primaryText={document.file_name} 
                  key={index} id={document.file_id} 
                  leftIcon={<ContentCopy />} 
                  rightIconButton={
                    <IconButton onTouchTap={this.deleteFiles.bind(this, document.file_id)}>
                    <Delete color={'#252830'} hoverColor={'#DD4C3C'} />
                    </IconButton>
                  } 
                />
              )}
            </List>
          </Paper>
          <Paper className="cabinet_container">
            <FlatButton
              label="Add Cabinet"
              labelStyle={{color: white}}
              backgroundColor="#91A30E"
              hoverColor="#73820B"
              icon={<Add color={white}/>}
              className="addCabinet"
              onTouchTap={this.handleDialog.bind(this, 'cabinetOpen', true)}
            />
            <br/><br/>
            <div>
              {this.state.cabinets.map((cabinet, index)  =>
                <Paper style={customStyle.paperStyle} zDepth={2} key={index}>
                  <div className="cab">
                    <IconButton className="cabBtn" onTouchTap={this.delCabinet.bind(this, cabinet.c_id)}>
                      <Delete color={'#252830'} hoverColor={'#DD4C3C'} />
                    </IconButton>
                    <IconButton className="cabBtn" onTouchTap={this.editCabinet.bind(this, cabinet.c_id)}>
                      <Edit color={'#C68100'} hoverColor={'#FFA500'} />
                    </IconButton>
                    <h3>{cabinet.cabinet_code}</h3>
                    <ul className="cabLevels">
                      { this.loopLevel(cabinet.level_num) }
                    </ul>
                  </div>
                </Paper>
              )};
            </div>
          </Paper>
        </div>

        {/* Add Files*/}
        <Dialog
          actions={fileActions}
          modal={false}
          open={this.state.filesOpen}
          onRequestClose={this.handleDialog.bind(this, 'filesOpen', false)}
          autoScrollBodyContent={true}
          title="File Registration">
          <div className="reg_modal">
            <div className={this.state.msgClass}>{this.state.message}</div>
            <br/><br/>
            <div>
              <label>Category: </label>
              <SelectField
                value={this.state.files['category']}
                onChange={this.handleChange}
              >
                <MenuItem value={1} primaryText="Office Supplies" />
                <MenuItem value={2} primaryText="OT Form" />
                <MenuItem value={3} primaryText="Leave Form" />
                <MenuItem value={4} primaryText="Voucher" />
                <MenuItem value={5} primaryText="Permits" />
              </SelectField>
            </div>
            <div>
              <label>Name: </label>
              <TextField
                name="name"
                value={this.state.files['name']}
                onChange={this.setValue.bind(this, 'files', 'name')}
                inputStyle={{ border: '1px #E0E0E0 solid', padding: '5px', height: '30px'}}
                underlineShow={false}
              />
            </div>
            <div>
              <label>Description: </label>
              <TextField
                name="description"
                type="textarea"
                multiLine={true}
                rows= {5}
                value={this.state.files['description']}
                onChange={this.setValue.bind(this, 'files', 'description')}
                inputStyle={{ border: '1px #E0E0E0 solid', padding: '5px'}}
                underlineShow={false}
              />
            </div>
            <br/>
          </div>
        </Dialog>

        {/* Add Cabinets*/}
        <Dialog
          actions={cabinetActions}
          modal={false}
          open={this.state.cabinetOpen}
          onRequestClose={this.handleDialog.bind(this, 'cabinetOpen', false)}
          autoScrollBodyContent={true}
          title="Cabinet Registration">
          <div className="reg_modal">
            <div className={this.state.msgClass}>{this.state.message}</div>
            <br/><br/>
            <div>
              <label>Cabinet Code: </label>
              <TextField
                name="cabinet_code"
                value={this.state.cabinet['cabinet_code']}
                onChange={this.setValue.bind(this, 'cabinet', 'cabinet_code')}
                inputStyle={{ border: '1px #E0E0E0 solid', padding: '5px', height: '30px'}}
                underlineShow={false}
              />
            </div>
            <div>
              <label>Cabinet Level: </label>
              <TextField
                name="level_num"
                type="number"
                onInput={(e)=>{ 
                    e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,1)
                }}
                min={0}
                value={this.state.cabinet['level_num']}
                onChange={this.setValue.bind(this, 'cabinet', 'level_num')}
                inputStyle={{ border: '1px #E0E0E0 solid', padding: '5px', height: '30px', width: '80px'}}
                underlineShow={false}
              />
            </div>
            <div>
              <Checkbox
                label="Locked?"
                labelPosition="left"
                labelStyle={{color: '#666666'}}
                checked={this.state.cabinet['locked']}
                style={{width: '190px'}}
                onCheck={this.handleCheck.bind(this)}
              />
            </div>
            <div>
              <label>Description: </label>
              <TextField
                name="short_desc"
                type="textarea"
                multiLine={true}
                rows= {5}
                value={this.state.cabinet['short_desc']}
                onChange={this.setValue.bind(this, 'cabinet', 'short_desc')}
                inputStyle={{ border: '1px #E0E0E0 solid', padding: '5px'}}
                underlineShow={false}
              />
            </div>
            <br/>
          </div>
        </Dialog>

        {/* Member Listing */}
        <Dialog
          actions={memberActions}
          modal={false}
          open={this.state.memberListingOpen}
          onRequestClose={this.handleDialog.bind(this, 'memberListingOpen', false)}
          autoScrollBodyContent={true}
          title="Member Listing">
            <br/>
            <Table>
              <TableHeader enableSelectAll={false} displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>Email</TableHeaderColumn>
                  <TableHeaderColumn>Username</TableHeaderColumn>
                  <TableHeaderColumn>User Level</TableHeaderColumn>
                  <TableHeaderColumn>Actions</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} showRowHover={true}>
                {this.state.members.map((member, index)  =>
                  <TableRow key={index}>
                    <TableRowColumn>{ member.name }</TableRowColumn>
                    <TableRowColumn>{ member.email }</TableRowColumn>
                    <TableRowColumn>{ member.username }</TableRowColumn>
                    <TableRowColumn>{ member.user_level }</TableRowColumn>
                    <TableRowColumn>
                      <IconButton onTouchTap={this.editMember.bind(this, member.member_id)}><Edit color={'#C68100'} hoverColor={'#FFA500'} /></IconButton>
                      <IconButton onTouchTap={this.delMember.bind(this, member.member_id)}><Delete color={'#252830'} hoverColor={'#DD4C3C'} /></IconButton>
                    </TableRowColumn>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </Dialog>

        {/* Member Registration Popup */}
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleDialog.bind(this, 'open', false)}
          autoScrollBodyContent={true}
          title="Member Registration">
          <div className="reg_modal">
            <div className={this.state.msgClass}>{this.state.message}</div>
            <br/><br/>
            <div>
              <label>Name: </label>
              <TextField
                name="name"
                value={this.state.member['name']}
                onChange={this.setValue.bind(this, 'member', 'name')}
                inputStyle={{ border: '1px #E0E0E0 solid', padding: '5px', height: '30px'}}
                underlineShow={false}
              />
            </div>
            <div>
              <label>Email: </label>
              <TextField
                name="email"
                type="email"
                value={this.state.member['email']}
                onChange={this.setValue.bind(this, 'member', 'email')}
                inputStyle={{ border: '1px #E0E0E0 solid', padding: '5px', height: '30px'}}
                underlineShow={false}
              />
            </div>
            <div>
              <label>Username: </label>
              <TextField
                name="username"
                value={this.state.member['username']}
                onChange={this.setValue.bind(this, 'member', 'username')}
                inputStyle={{ border: '1px #E0E0E0 solid', padding: '5px', height: '30px'}}
                underlineShow={false}
              />
            </div>
            <div>
              <label>Password: </label>
              <TextField
                name="password"
                value={this.state.member['password']}
                onChange={this.setValue.bind(this, 'member', 'password')}
                type="password"
                inputStyle={{ border: '1px #E0E0E0 solid', padding: '5px', height: '30px'}}
                underlineShow={false}
              />
            </div>
            <div>
              <label>Retype-Password: </label>
              <TextField
                name="confirmPassword"
                value={this.state.member['confirmPassword']}
                onChange={this.setValue.bind(this, 'member','confirmPassword')}
                type="password"
                inputStyle={{ border: '1px #E0E0E0 solid', padding: '5px', height: '30px'}}
                underlineShow={false}
              />
            </div>
            <div>
              <label>User Type: </label>
              <SelectField
                value={this.state.member['userType']}
                onChange={this.handleChange}
              >
                <MenuItem value={1} primaryText="Administrator" />
                <MenuItem value={2} primaryText="Member" />
              </SelectField>
            </div>
          </div>
        </Dialog>

        {/*  History Popup */}
        <Dialog
          actions={historyActions}
          modal={false}
          open={this.state.historyOpen}
          onRequestClose={this.handleDialog.bind(this, 'historyOpen', false)}
          autoScrollBodyContent={true}
          title="History">
          <div className="history_modal">
          <ul>
            <li>
              <h3>2/1/2017</h3>
              <ul>
                <li>
                  <time>3:00pm</time>
                  <div>DocumentName <i> (moved from cabinet1 level1 to cabinet2 level1)</i></div>
                  <div><span>Last Edited by: UserName</span></div>
                </li>
                <li>
                  <time>4:00pm</time>
                  <div>DocumentName <i> (moved from cabinet1 level1 to cabinet2 level1)</i></div>
                  <div><span>Last Edited by: UserName</span></div>
                </li>
              </ul>
            </li>
            <li>
              <h3>2/2/2017</h3>
              <ul>
                <li>
                  <time>10:00am</time>
                  <div>DocumentName<i> (moved from cabinet2 level1 to cabinet2 level1)</i></div>
                  <div><span>Last Edited by: UserName</span></div>
                </li>
              </ul>
            </li>
          </ul>
          </div>
        </Dialog>

        {/* Confirm Delete */}
        <Dialog
          actions={cDelAction}
          modal={false}
          open={this.state.cDelOpen}
          onRequestClose={this.handleDialog.bind(this, 'cDelOpen', false)}
          contentStyle={{width: '400px'}}
        >
          Proceed to delete?
        </Dialog>
       </div>
      </MuiThemeProvider>
    );
  }
};

export default Top;