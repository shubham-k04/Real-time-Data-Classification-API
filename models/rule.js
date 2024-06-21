const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
    rule: [{ type: String, }],
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
}, 
{ timestamps: true }
);

const Rule = mongoose.model("rule", ruleSchema);

module.exports = Rule;
