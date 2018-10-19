const express = require("express");
const router = express.Router();

const axios = require("axios");

const config = require("../../config");

const authRoutes = require("./auth");
const { userMiddleware, checkLoggedIn } = require("../../utils/middleware");

router.use(userMiddleware);

router.get("/", (req, res) => {
    res.send({ hello: true });
});

router.use("/auth", authRoutes);

router.use((req, res) => {
    res.status(404).send({ error: "not-found" });
});

module.exports = router;
