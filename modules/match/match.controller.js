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
    return res.json(match);
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

  try {
    // Find matches where any player has the given parentId
    const matches = await Match.find({
      $or: [
        { "teamA.players.paerent": parentId },
        { "teamB.players.paerent": parentId }
      ]
    });

    // Return the matches
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching matches", error });
  }
};