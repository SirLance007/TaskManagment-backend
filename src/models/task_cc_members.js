import { DataTypes } from "sequelize";

const defineTaskCcMember = (sequelize) => {
  const TaskCcMember = sequelize.define(
    "TaskCcMember",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      task_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false }
    },
    { tableName: "task_cc_members", timestamps: false }
  );

  TaskCcMember.associate = (models) => {
    if (models.Task) {
      TaskCcMember.belongsTo(models.Task, { foreignKey: "task_id", onDelete: "CASCADE" });
    }
    if (models.User) {
      TaskCcMember.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });
    }
  };
  return TaskCcMember;
};

export default defineTaskCcMember;