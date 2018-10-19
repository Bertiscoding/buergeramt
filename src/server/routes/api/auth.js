const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const SignaturitClient = require("signaturit-sdk");

let client = new SignaturitClient(config.SIGNATURIT_API_KEY, false); // false for sanbox, true for production

router.post("/sign-up", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) res.status(400).send({ error: "Missing Credentials." });

    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) return res.status(400).send({ error: "E-Mail exists already." });
        })
        .then(res => {
            const hashedPassword = bcrypt.hashSync(password, 10);
            return new User({ email, password: hashedPassword }).save();
        })
        .then(user => {
            const cleanUser = user.toObject();

            delete cleanUser.password;

            const token = jwt.sign(cleanUser, config.SECRET_JWT_PASSPHRASE);
            res.send({ token });
        });
});

router.post("/getclient", (req, res) => {
    const { id } = req.params;
    console.log("AT post CLIENT");
    recipient = { name: "Noe", email: "noelials@hotmail.es" };

    files = ["../../public/Muster.pdf"];

    sign_params = {
        subject: "Receipt number 250",
        body: "Please, can you sign this document?"
    };

    // client
    //     .createSignature(files, [{ email: "noelials.otro@gmail.com" }])
    //     .then(result => {
    //         console.log("result create signature", result);
    //     })
    //     .catch(err => console.log("error create signature", err));

    client
        .createContact(recipient.email, recipient.name)
        .then(result => {
            console.log("result create contact", result);
            client
                .createSignature(files, recipient, sign_params)
                .then(result => {
                    console.log("result create signature", result);
                })
                .catch(err => console.log("error create signature", err));
        })
        .catch(err => console.log("error create contact", err));
});

router.get("/getclient", (req, res) => {
    client
        .getSignatures()
        .then(result => {
            console.log("result contacts", result);
        })
        .catch(err => console.log("error contacts", err));
});

router.post("/sign-in", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) res.status(400).send({ error: "Missing Credentials." });

    User.findOne({ email }).then(existingUser => {
        if (!existingUser) return res.status(400).send({ error: "User does not exist." });

        const passwordsMatch = bcrypt.compareSync(password, existingUser.password);

        if (!passwordsMatch) return res.status(400).send({ error: "Password is incorrect." });

        const cleanUser = existingUser.toObject();

        delete cleanUser.password;

        const token = jwt.sign(cleanUser, config.SECRET_JWT_PASSPHRASE);
        res.send({ token });
    });
});

module.exports = router;
