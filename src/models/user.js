import { DataTypes } from "sequelize";

const defineUser = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      // implement dealer id
      user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    },
    { tableName: "users", timestamps: false }
  );

  User.associate = (models) => {
    if (models.Task) {

      User.hasMany(models.Task, { foreignKey: "assignee_id", as: "assignedTasks" });
      User.hasMany(models.Task, { foreignKey: "created_by", as: "CreatedTasks" });
    }
    if (models.Comment) {
      User.hasMany(models.Comment, { foreignKey: "user_id" });
      
    }
  };
  return User;
};

export default defineUser;