"user strict"

const mongoose = require("mongoose");
const ROLES = require("../constants/role.constants.js");

const roleSchema = new mongoose.Schema(
    {
        nameRole: { type: String, required: true, enum: ROLES },
    },
    {
        versionKey: false,
    }
);

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;