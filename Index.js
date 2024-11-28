const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded form data

// Serve the static `index.html` file
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.post("/bfhl", (req, res) => {
  const { data } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({
      is_success: false,
      error: "Invalid input format",
    });
  }

  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter(
    (item) => isNaN(item) && typeof item === "string"
  );

  const lowercaseAlphabets = alphabets.filter((char) => /^[a-z]$/.test(char));
  const highestLowercaseAlphabet =
    lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().pop()] : [];
  res.status(200).json({
    is_success: true,
    
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
  });
});

// Fallback for unmatched routes (optional)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
