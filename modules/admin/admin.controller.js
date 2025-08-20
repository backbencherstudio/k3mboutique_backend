require("dotenv").config();
const Players = require("../players/players.model");
const Match = require("../match/match.model");
const fs = require("fs");
const path = require("path");

exports.createNewPlayer = async (req, res) => {
  try {
    const {
      username,
      name,
      parent_email,
      parent_phone,
      position,
      jersey_number,
      parent_name,
      birth_date,
    } = req.body;
    //console.log(req.body);

    // Check for missing required fields
    if (!name || !username || !parent_email || !parent_name || !birth_date) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if a player with the same username already exists
    const player = await Players.findOne({
      username,
    });

    if (player) {
      return res.status(400).json({ message: "This username is already used" });
    }

    // Create a new player instance
    const newPlayer = new Players({
      username,
      name,
      parent_email,
      parent_phone,
      position,
      jersey_number,
      parent_name,
      birth_date,
    });

    // Save the new player to the database
    const savedPlayer = await newPlayer.save();

    // Send a success response with the saved player
    return res.status(201).json({
      message: "Player created successfully!",
      player: savedPlayer,
    });
  } catch (error) {
    console.error("Error creating new player:", error);
    return res.status(500).json({ message: "Failed to create new player." });
  }
};

exports.updatePlayer = async (req, res) => {
  try {
    const player = await Players.findById(req.params.playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const { username, parent_email, jersey_number, ...updateData } = req.body;

    if (jersey_number) {
      updateData.jersey_number = Number(jersey_number);
    }

    if (req.files && req.files.avatar) {
      const avatarFile = req.files.avatar[0];
      if (player.avatar) {
        deleteImage(player.avatar);
      }
      updateData.avatar = avatarFile.filename;
    }

    // Perform the update operation
    const updatedPlayer = await Players.findByIdAndUpdate(
      req.params.playerId,
      updateData,
      { new: true }
    );

    return res.status(200).json(updatedPlayer);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getPlayer = async (req, res) => {
  try {
    const player = await Players.findById(req.params.playrId);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    return res.status(200).json({ player });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllPlayer = async (req, res) => {
  try {
    const players = await Players.find({
      active: true,
    });
    return res.status(200).json({ players });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating players",
      error: error.message,
    });
  }
};

exports.createMatch = async (req, res) => {
  try {
    const {
      teamAName,
      teamBName,
      date,
      start_time,
      end_time,
      stadium,
      manager,
    } = req.body;

    // Create the match without players
    const match = new Match({
      teamA: { name: teamAName, players: [] },
      teamB: { name: teamBName, players: [] },
      date,
      start_time,
      end_time,
      stadium,
      manager,
    });

    await match.save();
    res.status(201).json({
      message: "Match created successfully",
      match,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating match",
      error: error.message,
    });
  }
};

// exports.addPlayersToTeam = async (req, res) => {
//   try {
//     const { teamName, players, isStartingArray } = req.body;

//     if (teamName !== "teamA" && teamName !== "teamB") {
//       return res.status(400).json({ message: "Invalid team name" });
//     }

//     if (players.length > 15) {
//       return res
//         .status(400)
//         .json({ message: "You can not add more than 15 players" });
//     }

//     const uniquePlayers = [...new Set(players)];
//     if (uniquePlayers.length !== players.length) {
//       return res
//         .status(400)
//         .json({ message: "Player IDs must be unique in the request" });
//     }

//       // Check if all players exist in the Player model
//     const invalidPlayers = [];
//     for (let playerId of players) {
//       const playerExists = await Players.exists({ _id: playerId });
//       if (!playerExists) {
//         invalidPlayers.push(playerId);
//       }
//     }

//     if (invalidPlayers.length > 0) {
//       return res
//         .status(400)
//         .json({ message: `Invalid player IDs: ${invalidPlayers.join(", ")}` });
//     }

//     const match = await Match.findById(req.params.matchId);

//     if (!match) {
//       return res.status(404).json({ message: "Match not found" });
//     }

//     const existingPlayers = match[teamName].players.map((player) =>
//       player.player.toString()
//     );

//     const newPlayers = players.filter(
//       (playerId) => !existingPlayers.includes(playerId)
//     );
//     const newIsStarting = newPlayers.map(
//       (playerId, index) => isStartingArray[players.indexOf(playerId)]
//     );

//     if (newPlayers.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "All players are already in the team" });
//     }

//     const playersToAdd = newPlayers.map((playerId, index) => ({
//       player: playerId,
//       isStarting: newIsStarting[index],
//     }));

//     match[teamName].players.push(...playersToAdd);
//     await match.save()

//     return res.json(match);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

exports.addPlayersToTeam = async (req, res) => {
  try {
    const { teamName, players, isStartingArray, parentsAray } = req.body;

    const match = await Match.findById(req.params.matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const userIdString = match?.manager?.userId?.toString();
    //console.log(userIdString)
    if (user.role === "admin" || userIdString === req.userId) {
      if (teamName !== "teamA" && teamName !== "teamB") {
        return res.status(400).json({ message: "Invalid team name" });
      }

      if (players.length > 15) {
        return res
          .status(400)
          .json({ message: "You cannot add more than 15 players" });
      }

      const uniquePlayers = [...new Set(players)];
      if (uniquePlayers.length !== players.length) {
        return res
          .status(400)
          .json({ message: "Player IDs must be unique in the request" });
      }

      // Check if all players exist in the Player model
      const invalidPlayers = [];
      for (let playerId of players) {
        const playerExists = await Players.exists({ _id: playerId });
        if (!playerExists) {
          invalidPlayers.push(playerId);
        }
      }

      if (invalidPlayers.length > 0) {
        return res
          .status(400)
          .json({
            message: `Invalid player IDs: ${invalidPlayers.join(", ")}`,
          });
      }

      const existingPlayers = match[teamName].players.map((player) =>
        player.player.toString()
      );

      // Filter out the players that are already in the team
      const newPlayers = players.filter(
        (playerId) => !existingPlayers.includes(playerId)
      );

      const newIsStarting = newPlayers.map(
        (playerId, index) => isStartingArray[players.indexOf(playerId)]
      );

      // Update the isStarting status for existing players
      for (let i = 0; i < match[teamName].players.length; i++) {
        const existingPlayer = match[teamName].players[i];
        const playerIndex = players.indexOf(existingPlayer.player.toString());
        if (playerIndex !== -1) {
          // If player exists, we toggle isStarting status
          existingPlayer.isStarting = isStartingArray[playerIndex]; // Set to the new isStarting value
          match[teamName].players[i] = existingPlayer; // Update the player in the team
        }
      }

      // Now add new players to the team
      if (newPlayers.length > 0) {
        const playersToAdd = newPlayers.map((playerId, index) => ({
          player: playerId,
          isStarting: newIsStarting[index],
          paerent: parentsAray[index],
        }));

        match[teamName].players.push(...playersToAdd);
      }

      // Save the updated match
      await match.save();

      return res.status(200).json(match);
    }

    return res
      .status(400)
      .json({ message: "You can not access update this match" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

function deleteImage(imagePath) {
  const uploadsFolder = path.resolve(__dirname, "..", "..", "uploads/images");
  const filePath = path.join(uploadsFolder, imagePath);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File does not exist:", err);
      return;
    }
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting the file:", err);
        return;
      }
      console.log("File deleted successfully");
    });
  });
}
