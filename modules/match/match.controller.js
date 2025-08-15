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
      
      const validGoalScorers = goalScorersA.filter(playerId =>
        match.teamA.players.some(p => p.player.toString() === playerId)
      );
      match.teamA.goalScorers.push(...validGoalScorers);
    }
    if (goalAssistsA && goalAssistsA.length > 0) {
      
      const validGoalAssists = goalAssistsA.filter(playerId =>
        match.teamA.players.some(p => p.player.toString() === playerId)
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

