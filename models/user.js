'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Please enter a valid email"
        }
      }
    },
    name: {
      type: DataTypes.STRING, 
      validate: {
        len: {
          args: [1, 99], 
          msg: "Invalid user name. Must be between 1 and 99 characters."
        }
      }

    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: "Password must be at last 8 characters"
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: function (pendingUser, options) {
        if (pendingUser && pendingUser.password) {
          var hash = bcrypt.hashSync(pendingUser.password, 12); 
          pendingUser.password = hash;
        }
      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
  };
  user.prototype.validPassword = function(passwordTyped) { // assign new key to my user prototype...refer to every user that you can create and store into database
    return bcrypt.compareSync(passwordTyped, this.password);
  }
  user.prototype.toJSON = function() {
    var userData = this.get();
    delete userData.password; 
    return userData;
  }
  return user;
};

