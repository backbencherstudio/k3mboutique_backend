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

exports.getPlayer = async(req, res) =>{
  try{
    const player = await Players.findById(req.params.playrId)

  if(!player){
    return res.status(404).json({ message: "Player not found" });
  }
  return res.status(200).json({player})
  }
  catch(error){
    return res.status(500).json({ message: error.message });
  }
}

exports.getAllPlayer = async(req, res) =>{
  try{
    const players = await Players.find()
    return res.status(200).json({players})
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      message: "Error updating players",
      error: error.message,
    });
  }
}


exports.createMatch = async (req, res) => {
   try {
    const { teamAName, teamBName, date, start_time, end_time, stadium, manager } = req.body;

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
}



exports.updateMatchPlayers = async (req, res) => {
  try {
    const { matchId } = req.params; 
    const { team, players } = req.body; 

    
    if (!["teamA", "teamB"].includes(team)) {
      return res.status(400).json({
        message: "Invalid team name. It must be 'teamA' or 'teamB'.",
      });
    }

    
    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    
    match[team].players = players;

    await match.save();

    res.status(200).json({
      message: `Players added to ${team} successfully`,
      match,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating players",
      error: error.message,
    });
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