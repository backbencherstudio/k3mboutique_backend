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
      match.teamA.goalScorers.push(...goalScorersA);
    }
    if (goalAssistsA && goalAssistsA.length > 0) {
      match.teamA.goalAssists.push(...goalAssistsA);
    }
    match.teamA.totalGoals = match.teamA.goalScorers.length;

   
    // if (goalScorersB && goalScorersB.length > 0) {
    //   match.teamB.goalScorers.push(...goalScorersB);
    // }
    // if (goalAssistsB && goalAssistsB.length > 0) {
    //   match.teamB.goalAssists.push(...goalAssistsB);
    // }
    // match.teamB.totalGoals = match.teamB.goalScorers.length;

  
    await match.save();

    // Send the updated match as the response
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
