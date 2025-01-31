// External import
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

// Internal import
const uploadAWSAutomate = require("../middleware/aws");
const Artist = require("../models/artists.model");
const Tracks = require("../models/tracks.model");

// register a new track in the DB - POST
const createTrack = async (req, res) => {
  try {
    const id = req.params.id;
    const fileLocation = await uploadAWSAutomate(req.file);
    const FileURL = await fileLocation?.Location;
    const FileName = await fileLocation?.key?.split("new-")[1];

    const newTrack = await Tracks.create({
      title: FileName,
      track: FileURL,
    });

    const Musician = await Artist.findById(id);
    await Musician?.tracks.push(newTrack);
    const Track = await Tracks.findOne({ title: FileName });
    await Track?.artists.push(Musician);

    await Musician?.save();
    await Track?.save();

    return res.status(StatusCodes.OK).send(id);
  } catch (error) {
    if (error) console.log(error);
    return res.status(StatusCodes.NOT_FOUND).send("couldnt save new track");
  }
};

// get track by artists id - GET
const showTrack = async (req, res) => {
  try {
    const tracks = Artist.findById(req.params.id)
      .populate("tracks")
      .exec((err, person) => {
        return res.status(StatusCodes.OK).send(person);
      });
  } catch (err) {
    if (err)
      return res
        .status(StatusCodes.NOT_FOUND)
        .send("couldnt retrieve artist tracks");
  }
};

// get all tracks in db - GET
const getallTracks = async (req, res) => {
  try {
    const alltracks = await Tracks.find({});
    console.log(alltracks);
    return res.status(StatusCodes.OK).send(alltracks);
  } catch (err) {
    console.log(err);
    if (err) return res.status(StatusCodes.NOT_FOUND).send("no tracks found");
  }
};

module.exports = {
  showTrack,
  createTrack,
  getallTracks,
};
