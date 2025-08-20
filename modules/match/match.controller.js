const { Types } = require("mongoose");
const Match = require("../match/match.model");

exports.getOnematch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match) {
      return res.status(200).json("match not found");
    }
    return res.status(200).json({ match });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.updatedMatch = async (req, res) => {
  try {
    const { goalScorersA, goalAssistsA } = req.body;
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const userIdString = match?.manager?.userId?.toString();
    //console.log(userIdString)
    if (user.role === "admin" || userIdString === req.userId) {
      if (goalScorersA && goalScorersA.length > 0) {
        const validGoalScorers = goalScorersA.filter((playerId) =>
          match.teamA.players.some((p) => p.player.toString() === playerId)
        );
        match.teamA.goalScorers.push(...validGoalScorers);
      }
      if (goalAssistsA && goalAssistsA.length > 0) {
        const validGoalAssists = goalAssistsA.filter((playerId) =>
          match.teamA.players.some((p) => p.player.toString() === playerId)
        );
        match.teamA.goalAssists.push(...validGoalAssists);
      }
      match.teamA.totalGoals = match.teamA.goalScorers.length;
      await match.save();
      return res.status(200).json(match);
    }
    return res
      .status(400)
      .json({ message: "You can not access update this match" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

exports.getAllMatch = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const allMatches = await Match.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalMatches = await Match.countDocuments();

    const totalPages = Math.ceil(totalMatches / limit);

    res.status(200).json({
      matches: allMatches,
      currentPage: page,
      totalPages: totalPages,
      totalMatches: totalMatches,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching matches", error: err.message });
  }
};

exports.getParentAllMatches = async (req, res) => {
  const parentId = req.params.parentId;
  const category = req.query.category; // 'upcoming' or 'history'
  const currentDate = new Date();

  if (!Types.ObjectId.isValid(parentId)) {
    return res.status(400).json({ message: "Invalid parentId" });
  }
  const parentObjectId = new Types.ObjectId(parentId);
  try {
    let query = {
      $or: [
        { "teamA.players.paerent": parentId },
        { "manager.userId": parentObjectId },
        // { "teamB.players.paerent": parentId }
      ],
    };

    // Add date filter based on category
    if (category === "upcoming") {
      query.date = { $gte: currentDate };
    } else if (category === "history") {
      query.date = { $lt: currentDate };
    }
    // If no category specified, return all matches (both past and future)

    const matches = await Match.find(query).sort({
      date: category === "upcoming" ? 1 : -1,
    });

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching matches", error });
  }
};
