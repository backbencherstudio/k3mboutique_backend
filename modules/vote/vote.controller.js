const Match = require("../match/match.model");
const User = require("../users/users.models");


exports.startVoting = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    let match = await Match.findById(req.params.matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const userIdString = match?.manager?.userId?.toString();
    
    if (user.role === "admin" || userIdString === req.userId) {
      match = await Match.findByIdAndUpdate(
        req.params.matchId,
        { votingOpen: true },
        { new: true }
      );

      return res.status(200).json(match);
    }
    return res
      .status(400)
      .json({ message: "You can not do start match voting" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





exports.submitVote = async (req, res) => {
  try {
    const { matchId, playerId, parentId } = req.body;

    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (!match.votingOpen) {
      return res
        .status(400)
        .json({ message: "Voting is not open for this match" });
    }

    const isParentValid = match.teamA.players.some((p) => {
      return p.paerent?.toString() === parentId;
    });

    if (!isParentValid) {
      return res
        .status(403)
        .json({ message: "Parent not authorized in this match." });
    }

    const playerIndex = match.teamA.players.findIndex(
      (p) => p.player.toString() === playerId
    );

    if (playerIndex === -1) {
      return res.status(404).json({ message: "Player not found in teamA." });
    }

    if (match.votedParents && match.votedParents.includes(parentId)) {
      return res
        .status(400)
        .json({ message: "This parent has already voted." });
    }

    match.teamA.players[playerIndex].votes += 1;

    if (!match.votedParents) match.votedParents = [];
    match.votedParents.push(parentId);

    await match.save();

    res.status(200).json({
      message: "Vote submitted successfully",
      player: match.teamA.players[playerIndex].player,
      newVoteCount: match.teamA.players[playerIndex].votes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





exports.endVoting = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const match = await Match.findById(req.params.matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    const userIdString = match?.manager?.userId?.toString();
    if (user.role === "admin" || userIdString === req.userId) {
      const allPlayers = [
        ...match.teamA.players.map((p) => ({
          player: p.player,
          votes: p.votes,
          team: "teamA",
        })),
      ];

      const manOfTheMatch = allPlayers.reduce((prev, current) =>
        prev.votes > current.votes ? prev : current
      );

      match.manOfTheMatch = manOfTheMatch.player;
      match.votingOpen = false;
      match.matchStatus = "Completed";

      await match.save();

      res.status(200).json({
        message: "Voting closed successfully",
        manOfTheMatch: manOfTheMatch.player,
      });
    }

    return res.status(400).json({ message: "You can not do end match voting" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





exports.getVotingResults = async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId)
      .populate("teamA.players.player", "name")
      .populate("manOfTheMatch", "name");

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
