module.exports = {
    IS_PRODUCTION: process.env.NODE_ENV === "production",
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/buergeramt",
    SECRET_JWT_PASSPHRASE: "TWLom9RDbmGYBtkHHPe4m8pKswyUY",
    SIGNATURIT_API_KEY:
        "PHhJbEMbKBlPEiOuGDCRlbSGjKpRbGhQQFrmfiPpQmNvYnCbRkEBZPMhIVatOxSKfrrNquGRDPRlUaycDCEHyA"
};
