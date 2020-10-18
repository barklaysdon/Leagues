const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leagueSchema = new Schema({
  name: String,
  country: String,
});

module.exports = mongoose.model("League", leagueSchema);
