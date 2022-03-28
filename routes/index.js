const router = require("express").Router();
const express = require('express');
const Ranking = require("../models/Historic.model")
const Map = require("../models/Map.model")
const Historique = require("../models/Historic.model")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/hof", async (req, res, next) => {//Hall of Fame
    try {
        const rankings = await Ranking.find()
        res.render("hof", {rankings})
    } catch (error) {
        console.error(error)
        next(error)
    }
});

router.get("/instructions", (req, res, next) => {
    res.render("instructions")

});

router.get("/game", async (req, res, next) => {
    try {
        const map = await Map.findOne({ current: true })
        if(map){
            const historics = await Historique.find({map: map._id})
            res.render("game", {map, historics})
        }
        else 
            res.render("game")
        } catch (error) {
            console.error(error)
            next(error)
    }
});

router.post("/game", async (req, res, next) => {//END-GAME
    try {
        console.log("ENDGAME")
        // const gameLogs = req.body// Need to figure out how to pass Historique data   
        // await Historique.create(gameLogs)
        res.redirect('/')
    } catch (error) {
        console.error(error)
        next(error)
    }
});

module.exports = router;
