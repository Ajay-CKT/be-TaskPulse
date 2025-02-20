const cron = require("node-cron");
const Task = require("../models/Task");

cron.schedule("* * * * *", async () => {
  // Runs every minute
  try {
    const dueTime = new Date();

    // Update tasks whose deadline has passed and are not "pending" or "completed"
    const result = await Task.updateMany(
      {
        deadline: { $lt: dueTime },
        status: { $nin: ["pending", "completed"] },
      },
      { $set: { status: "pending" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`Updated ${result.modifiedCount} overdue tasks.`);
    }
  } catch (error) {
    console.error("Error updating overdue tasks:", error);
  }
});

module.exports = cron;
