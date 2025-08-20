const Notification = require("./notification.model")




exports.sitOnManger = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate("matchId", "teamA.name teamB.name date");
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching notifications",
      error: error.message,
    });
  }
}

exports.markreadnotification =  async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating notification",
      error: error.message,
    });
  }
}


exports.markallnotificationRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { read: true }
    );
    
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating notifications",
      error: error.message,
    });
  }
}