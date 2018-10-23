const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const User = require("../../models/User");
const SignaturitClient = require("signaturit-sdk");

let client = new SignaturitClient(config.SIGNATURIT_API_KEY, false); // false for sandbox, true for production

router.post("/sign-up", (req, res) => {
    const { email, password } = req.body;
    const name = email.substring(0, email.lastIndexOf("@"));
    const recipient = { name: name, email: email };
    const files = ["/Users/Helene/Desktop/buergeramt/src/server/public/test.pdf"];

    brandingParams = {
        application_texts: {
            logo: "/Users/Helene/Desktop/buergeramt/src/server/public/mr_logo.png"
        }
    };

    if (!email || !password) res.status(400).send({ error: "Missing Credentials." });

    User.findOne({ email })
        // SIGN-UP
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

    // SEND EMAIL:
    client
        .createContact(recipient.email, recipient.name)
        .then(result => {
            client
                .createBranding(brandingParams)
                .catch(err => console.log("error create branding", err));
        })
        .then(res => {
            client
                .createSignature(
                    files,
                    { email: recipient.email },
                    {
                        body: "This is my message to you-ou-ouuuu"
                    }
                )
                .catch(err => console.log("error create signature", err));
        })
        .catch(err => console.log("error create contact", err));
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
