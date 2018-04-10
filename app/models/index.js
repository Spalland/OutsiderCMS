'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require("../../database.json")[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js'){ return; }
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});



db.sequelize = sequelize;
db.Sequelize = Sequelize;


// Assocs 

// Article Images
db.Article.belongsTo(db.Image, {foreignKey : 'image_id'});
db.Image.hasMany(db.Article, {foreignKey : 'image_id'});

// Article Category
db.Article.belongsTo(db.Category, {foreignKey : 'category_id'}); 
db.Category.hasMany(db.Article, {foreignKey: 'category_id'});

// Article Activity
db.Article.belongsTo(db.Activity, {foreignKey : 'activity_id'}); 
db.Activity.hasMany(db.Article, {foreignKey: 'activity_id'});

// Activity Images
db.Activity.belongsTo(db.Image, {foreignKey : 'image_id'}); 
db.Image.hasMany(db.Activity, {foreignKey: 'image_id'});



module.exports = db;
