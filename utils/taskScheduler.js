const cron = require("node-cron");
const Task = require("../models/Task");

module.exports = (io) => {
  cron.schedule("* * * * *", async () => {
    try {
      const result = await Task.updateMany(
        {
          deadline: { $lt: new Date() },
          status: { $nin: ["pending", "completed"] },
        },
        { $set: { status: "pending" } }
      );

      if (result.modifiedCount > 0) {
        console.log(
          `✅ ${result.modifiedCount} tasks moved to pending status.`
        );
        io.emit("taskUpdated"); // Use the passed Socket.io instance to emit the event
      } else {
        console.log("✅ No overdue tasks found.");
      }
    } catch (error) {
      console.error("❌ Error updating overdue tasks:", error);
    }
  });
};
