const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, CLIENT_URL } = require("../utils/config");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const Task = require("../models/Task");

const userController = {
  editProfile: async (request, response) => {
    try {
      const { name } = request.body;
      const { id } = request.params;
      await User.findByIdAndUpdate(id, { name });
      response.status(200).json({ message: "Updated successfully" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
  forgotPassword: async (request, response) => {
    try {
      const { email } = request.body;
      const existingUser = await User.findOne({ email: { $eq: email } });
      if (!existingUser)
        return response.status(404).json({ message: "User not exits" });
      const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
      const resetLink = `${CLIENT_URL}/reset-password/${token}`;
      existingUser.resetToken = token;
      await existingUser.save();
      await sendEmail(
        email,
        "Password Reset Link",
        `<p>
          Click <a href=${resetLink}>here</a> to reset your password. The link is
          valid for 1 hour.
        </p>`
      );
      response
        .status(200)
        .json({ message: `Password reset link sent to ${email}` });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
  resetPassword: async (request, response) => {
    try {
      const { password } = request.body;
      const { token } = request.params;
      const hashedPassword = await bcrypt.hash(password, 10);
      const decoded = jwt.verify(token, SECRET_KEY);
      const user = await User.findOne({
        email: { $eq: decoded.email },
        resetToken: { $eq: token },
      });
      if (!user)
        return response
          .status(404)
          .json({ messaage: "Invalid or expired token" });
      user.password = hashedPassword;
      user.resetToken = null;
      await user.save();
      response.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
  createTask: async (request, response) => {
    try {
      const { title, description, deadline, priority } = request.body;
      const userId = request.userId;
      const user = await User.findById(userId);
      if (!user) return response.status(404).json({ message: "Unauthorized" });
      const newTask = await Task({
        title,
        description,
        deadline,
        priority,
        createdBy: userId,
      });
      await newTask.save();
      user.tasks.push(newTask._id);
      await user.save();
      response.status(201).json({ message: "Task created successfully" });
      // Notify based on the deadline according to the priority
      const dueDate = new Date(deadline);
      const prioritySet = {
        low: "low",
        medium: "medium",
        high: "high",
      };

      if (prioritySet.high === priority) {
        [
          new Date(dueDate.getTime() - 60 * 60 * 1000),
          new Date(dueDate.getTime() - 30 * 60 * 1000),
        ].forEach((time, index) => {
          if (time > Date.now()) {
            setTimeout(async () => {
              try {
                await sendEmail(
                  user.email,
                  `Task Deadline Reminder : ${title}`,
                  `<p>
                    Your task <strong>${title}</strong> is due in
                    ${
                      index === 0 ? "1 hour" : "30 minutes"
                    }. Please complete it before the deadline: 
                    <strong>
                      ${new Date(deadline).toUTCString().slice(17)}
                    </strong>
                  </P>`
                );
              } catch (error) {
                console.error(
                  `Error sending notification mail for the task ${title}`
                );
              }
            }, time.getTime() - Date.now());
          }
        });
      } else if (prioritySet.medium === priority) {
        [new Date(dueDate.getTime() - 60 * 60 * 1000)].forEach((time) => {
          if (time > Date.now()) {
            setTimeout(async () => {
              try {
                await sendEmail(
                  user.email,
                  `Task Deadline Reminder : ${title}`,
                  `<p>
                      Your task <strong>${title}</strong> is due in 1 hour.
                      Please complete it before the deadline: 
                    <strong>
                    ${new Date(deadline).toUTCString().slice(17)}</strong> 
                    </P>`
                );
              } catch (error) {
                console.error(
                  `Error sending notification mail for the task ${title}`
                );
              }
            }, time.getTime() - Date.now());
          }
        });
      }
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
  updateTask: async (request, response) => {
    try {
      const { taskId } = request.params;
      const { title, description, deadline, priority } = request.body;
      const userId = request.userId;
      const user = await User.findById(userId);
      if (!user) return response.status(404).json({ message: "Unauthorized" });
      await Task.findByIdAndUpdate(
        taskId,
        {
          title,
          description,
          deadline,
          priority,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      response.status(200).json({ message: "Task updated successfully" });
      // Notify based on the deadline according to the priority
      const dueDate = new Date(deadline);
      const prioritySet = {
        low: "low",
        medium: "medium",
        high: "high",
      };

      if (prioritySet.high === priority) {
        [
          new Date(dueDate.getTime() - 60 * 60 * 1000),
          new Date(dueDate.getTime() - 30 * 60 * 1000),
        ].forEach((time, index) => {
          if (time > Date.now()) {
            setTimeout(async () => {
              try {
                await sendEmail(
                  user.email,
                  `Task Deadline Reminder : ${title}`,
                  `<p>Your task "${title}" is due ${
                    index === 0 ? "in 1 hour" : "in 30 minutes"
                  }. Please complete it before the deadline: ${new Date(
                    deadline
                  )
                    .toUTCString()
                    .slice(17)}</P>`
                );
              } catch (error) {
                console.error(
                  `Error sending notification mail for the task ${title}`
                );
              }
            }, time.getTime() - Date.now());
          }
        });
      } else if (prioritySet.medium === priority) {
        [new Date(dueDate.getTime() - 60 * 60 * 1000)].forEach(
          (time, index) => {
            if (time > Date.now()) {
              setTimeout(async () => {
                try {
                  await sendEmail(
                    user.email,
                    `Task Deadline Reminder : ${title}`,
                    `<p>Your task "${title}" is due in 1 hour
                    }. Please complete it before the deadline: ${new Date(
                      deadline
                    )
                      .toUTCString()
                      .slice(17)}</P>`
                  );
                } catch (error) {
                  console.error(
                    `Error sending notification mail for the task ${title}`
                  );
                }
              }, time.getTime() - Date.now());
            }
          }
        );
      }
    } catch (error) {
      response.status(500).json({ message: error.messaage });
    }
  },
  deleteTask: async (request, response) => {
    try {
      const { taskId } = request.params;
      const userId = request.userId;
      const user = await User.findById(userId);
      await Task.findByIdAndDelete(taskId);
      // user.tasks = user.tasks.filter((id) => id.toString() !== taskId);
      user.tasks.pop(taskId);
      await user.save();
      response.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      response.status(500).json({ message: error.messaage });
    }
  },
};

module.exports = userController;
