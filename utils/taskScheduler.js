const cron = require("node-cron");
const Task = require("../models/Task");

cron.schedule("* * * * *", async () => {
  try {
    const dueTime = new Date();

    await Task.updateMany(
      {
        deadline: { $lt: dueTime },
        status: { $nin: ["pending", "completed"] },
      },
      { $set: { status: "pending" } }
    );

    console.log("Overdue tasks updated successfully.");
  } catch (error) {
    console.error("Error updating overdue tasks:", error);
  }
});

module.exports = cron;
