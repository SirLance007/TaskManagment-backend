import { DataTypes } from "sequelize";

const defineTask = (sequelize) => {
  const Task = sequelize.define(
    "Task",
    {
      task_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      type: { type: DataTypes.ENUM("Task","Ticket"), allowNull: false },
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.STRING(500) },
      priority: { type: DataTypes.ENUM("Low","Medium","High"), allowNull: false },
      status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      assignee_id: { type: DataTypes.INTEGER, allowNull: true },
      due_date: { type: DataTypes.DATEONLY },
      is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_by: { type: DataTypes.INTEGER, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    },
    { tableName: "tasks", timestamps: false }
  );

  Task.associate = (models) => {
    if (models.User) {
      Task.belongsTo(models.User, { foreignKey: "assignee_id", as: "assignee", onDelete: "SET NULL" });
      Task.belongsTo(models.User, { foreignKey: "created_by", as: "Creator", onDelete: "SET NULL" });
    }
    if (models.TaskStatus) {
      Task.belongsTo(models.TaskStatus, { foreignKey: "status" });
    }
    if (models.Comment) {
      Task.hasMany(models.Comment, { foreignKey: "task_id" , onDelete: "CASCADE", hooks: true });
    }
    if (models.TaskCcMember) {
      Task.hasMany(models.TaskCcMember, { foreignKey: "task_id" , onDelete: "CASCADE", hooks: true });
    }
  };
  return Task;
};

export default defineTask;
