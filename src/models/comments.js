import { DataTypes } from "sequelize";

const defineComment = (sequelize) => {
  const Comment = sequelize.define(
    "Comment",
    {
      comment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      task_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: true },
      comment_text: { type: DataTypes.STRING(500), allowNull: false },
      is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    },
    { tableName: "comments", timestamps: false }
  );

  Comment.associate = (models) => {
    if (models.Task) {
      Comment.belongsTo(models.Task, { foreignKey: "task_id", onDelete: "CASCADE" });
    }
    if (models.User) {
      Comment.belongsTo(models.User, { foreignKey: "user_id", onDelete: "SET NULL" });
    }
  };
  return Comment;
};

export default defineComment;