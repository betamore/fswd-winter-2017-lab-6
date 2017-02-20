'use strict';
module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define('Task', {
    name: DataTypes.STRING,
    completedAt: DataTypes.DATE
  }, {
    classMethods: {
    //   associate: function(models) {
    //     // associations can be defined here
    //   }
    },
    instanceMethods: {
      isCompleted: function() {
        return !!this.completedAt;
      },
      markCompleted: function() {
        return this.update({ completedAt: new Date() });
      }
    }
  });
  return Task;
};
