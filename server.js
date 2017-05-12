var express = require('express');
var app = express();
var pg = require('pg');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var bodyParser = require('body-parser');


var conString = "postgres://cabinet:cabinet@192.168.0.42:5432/cabinet";

var client = new pg.Client(conString);
client.connect();


config = require('./webpack-dev-server.config')

compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.path,
    stats: {colors: true}
}))

app.use(webpackHotMiddleware(compiler, {
    log: console.log
}))

app.use(express.static('app'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**Members**/
//select all members
app.get('/api/1.0/members', function (req, res, next) {
  client.query('SELECT *  FROM tblmembers', function (err, result) {
    if (err) {
      return console.error('error happened during query', err)
    }
    res.status(200).json(result.rows);
  })
});

//add new member
app.post('/api/1.0/add_member', function (req, res, next) {
  var param = [req.body.name, req.body.email, req.body.username, req.body.password, req.body.userType];
  client.query('INSERT INTO tblmembers (name, email, username, password, user_level) VALUES($1, $2, $3, $4, $5)', param, function (err, result) {
    if (err) {
      return console.error('error happened during query', err)
    }
    res.status(200).json(result.rows);
  })
});

//delete member
app.post('/api/1.0/del_member', function (req, res, next) {
  client.query('DELETE FROM tblmembers WHERE member_id=$1',[req.body.id], function (err, result) {
    if (err) {
      return console.error('error happened during query', err)
    }
    res.status(200).json(result.rows);
  })
});

//edit member
app.post('/api/1.0/edit_member', function (req, res, next) {
  client.query('SELECT * FROM tblmembers WHERE member_id=$1',[req.body.id], function (err, result) {
    if (err) {
      return console.error('error happened during query', err)
    }
    res.status(200).json(result.rows);
  })
});

//update member
app.post('/api/1.0/update_member', function (req, res, next) {
  var param = [req.body.name, req.body.email, req.body.username, req.body.password, req.body.userType, req.body.member_id];
  client.query('UPDATE tblmembers SET(name, email, username, password, user_level) = ($1, $2, $3, $4, $5) WHERE member_id=$6',param, function (err, result) {
    if (err) {
      return console.error('error happened during query', err)
    }
    res.status(200).json(result.rows);
  })
});

/** Document/Contents **/
//select all document or content
app.get('/api/1.0/content', function (req, res, next) {
  client.query('SELECT *  FROM tblfiles', function (err, result) {
    if (err) {
      return console.error('error happened during query', err)
    }
    res.status(200).json(result.rows);
  })
});

//add new files
app.post('/api/1.0/add_files', function (req, res, next) {
  var param = [req.body.name, req.body.category, req.body.description, 1];
  client.query('INSERT INTO tblfiles (file_name, category_id, description, added_by) VALUES($1, $2, $3, $4)', param, function (err, result) {
    if (err) {
      return console.error('error happened during query', err)
    }
    res.status(200).json(result.rows);
  })
});

//delete file
app.post('/api/1.0/del_file', function (req, res, next) {
  client.query('DELETE FROM tblfiles WHERE file_id=$1',[req.body.id], function (err, result) {
    if (err) {
      return console.error('error happened during query', err)
    }
    res.status(200).json(result.rows);
  })
});

/** Cabinets **/
//select all cabinets
app.get('/api/1.0/cabinets', function(req, res, next){
  client.query('SELECT * FROM tblcabinets', function(err, result) {
    if(err){
      return console.error('error happened during query', err)
    }
    res.status(200).json(result.rows);
  });
});

//add new cabinet
app.post('/api/1.0/add_cabinet', function (req, res, next) {
  var param = [req.body.cabinet_code, req.body.level_num, req.body.locked, req.body.short_desc];
  client.query('INSERT INTO tblcabinets (cabinet_code, level_num, locked, short_desc) VALUES($1, $2, $3, $4)', param, function (err, result) {
    if (err) {
      return console.error('error happened during query', err)
    }
    res.status(200).json(result.rows);
  })
});

//edit member
app.post('/api/1.0/edit_cabinet', function (req, res, next) {
  client.query('SELECT * FROM tblcabinets WHERE c_id=$1',[req.body.id], function (err, result) {
    if (err) {
      return console.error('error happened during query', err)
    }
    res.status(200).json(result.rows);
  })
});

//update cabient
app.post('/api/1.0/update_cabinet', function (req, res, next) {
  var param = [req.body.cabinet_code, req.body.level_num, req.body.locked, req.body.short_desc, req.body.c_id];
  client.query('UPDATE tblcabinets SET(cabinet_code, level_num, locked, short_desc) = ($1, $2, $3, $4) WHERE c_id=$5',param, function (err, result) {
    if (err) {
      return console.error('error happened during query', err)
    }
    res.status(200).json(result.rows);
  })
});

//delete cabinet
app.post('/api/1.0/del_cabinet', function (req, res, next) {
  client.query('DELETE FROM tblcabinets WHERE c_id=$1',[req.body.id], function (err, result) {
    if (err) {
      return console.error('error happened during query', err)
    }
    res.status(200).json(result.rows);
  })
});

app.listen(3010, function () {
  console.log('Example app listening on port 3010!')
});