const cron = require("node-cron");
const Task = require("../models/Task");

cron.schedule("* * * * *", async () => {
  try {
    const dueTime = new Date();
    const overdueTasks = await Task.find({
      deadline: { $lt: dueTime },
      status: { $ne: "pending" },
      status: { $ne: "completed" },
    });

    if (overdueTasks.length > 0) {
      for (const task of overdueTasks) {
        task.status = "pending";
        await task.save();
      }
    }
  } catch (error) {
    console.error("Error updating overdue tasks:", error);
  }
});

module.exports = cron;
