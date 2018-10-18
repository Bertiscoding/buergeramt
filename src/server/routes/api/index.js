const express = require("express");
const router = express.Router();
const SignaturitClient = require("signaturit-sdk");

client = new SignaturitClient("SIGNATURIT_API_KEY", false); // false for sanbox, true for production

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

// new Signature request
router.post("/send", (req, res) => {
    // const { email } = req.body;

    recipients = { email: req.body.email };

    files = ["../../public/Muster.pdf"];

    sign_params = {
        subject: "Sign document",
        body: "Please sign this document" // need to add the template here
    };

    client
        .createSignature(files, recipients, sign_params)
        .then(res => {
            success: true;
        })
        .catch(error => {
            success: false;
        });
});

module.exports = router;
