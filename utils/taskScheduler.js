const cron = require("node-cron");
const Task = require("../models/Task");

cron.schedule("* * * * *", async () => {
  // Runs at midnight daily
  try {
    const result = await Task.updateMany(
      {
        deadline: { $lt: new Date() },
        status: { $nin: ["pending", "completed"] }, // Ensures we don't modify already pending/completed tasks
      },
      { $set: { status: "pending" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ ${result.modifiedCount} overdue tasks set to "pending"`);
    } else {
      console.log("✅ No overdue tasks found.");
    }
  } catch (error) {
    console.error("❌ Error updating overdue tasks:", error);
  }
});

module.exports = cron;
