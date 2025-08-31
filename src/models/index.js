import sequelize from "../config/db.js";
import defineUser from "./user.js";
import defineTask from "./task.js";
import defineComment from "./comments.js";
import defineTaskStatus from "./task_status.js";
import defineTaskCcMember from "./task_cc_members.js";

const db = {};

db.sequelize = sequelize;

db.User = defineUser(sequelize);
db.Task = defineTask(sequelize);
db.Comment = defineComment(sequelize);
db.TaskStatus = defineTaskStatus(sequelize);
db.TaskCcMember = defineTaskCcMember(sequelize);

Object.values(db)
  .filter((value) => value && typeof value.associate === "function")
  .forEach((model) => model.associate(db));

export const { User, Task, Comment, TaskStatus, TaskCcMember } = db;
export default db;