const router = require("express").Router();
const Map = require("../models/Map.model");
const Historic = require("../models/Historic.model");

const recordRate = 100;

router.get("/game", async (req, res, next) => {
  try {
    const map = await Map.findOne({ current: true });
    const user = req.session?.user;
    if (map) {
      const historics = await Historic.find({ map: map._id });
      res.send({ map, historics, user });
    } else {
      const newGrid = Map.createMap();
      const newMap = await Map.create({ cells: newGrid, recordRate });
      res.send({ map: newMap, historics: [], user });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/game", async (req, res, next) => {
  const { historic, ranking } = req.body;
  historic.user = req.session.user._id;
  // console.log(historic);
  try {
    await Historic.create(historic);
    console.log("After historic");
    await Map.findByIdAndUpdate(historic.map, { ranking });
    console.log("After Map");
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
