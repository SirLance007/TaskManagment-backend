import { DataTypes } from "sequelize";

const defineTaskStatus = (sequelize) => {
  const TaskStatus = sequelize.define(
    "TaskStatus",
    {
      status_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      type: { type: DataTypes.STRING(20), allowNull: false },
      status_name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    { tableName: "task_status", timestamps: false }
  );
  TaskStatus.associate = (models) => {
    if (models.Task) {
      TaskStatus.hasMany(models.Task, { foreignKey: "status" });
    }
  };
  return TaskStatus;
};

export default defineTaskStatus;
