require("dotenv").config();
const Players = require("../players/players.model");




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
    console.log(req.body);

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

