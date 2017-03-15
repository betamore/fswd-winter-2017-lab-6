'use strict';
module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define('Task', {
    name: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: true
        }
    },
    completedAt: DataTypes.DATE
  }, {
    classMethods: {
        loadCompleted: function() {
            return this.findAll({ where: { completedAt: { not: null }}});
        },
    //   associate: function(models) {
    //       models.Task.belongsTo(models.User);
    //   }
    },
    instanceMethods: {
      isCompleted: function() {
        return !!this.completedAt;
      },
      markCompleted: function() {
        return this.update({ completedAt: new Date() });
      },
    },
    scopes: {
        completed: {
            where: {
                completedAt: {
                    not: null
                }
            }
        },
        lastWeek: function() {
            return {
                where: {
                    completedAt: {
                        $lt: new Date()
                    }
                }
            };
        }
    }
  });
  return Task;
};
