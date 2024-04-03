"use strict";

const mongoose = require("mongoose");

const REPORTS = requiere("../constants/reportType.constants.js");
const reportSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        reportType: {
            type: String,
            enum: REPORTS,
            required: true,
        },
        contentReport: {
            type: String,
            required: true,
        },
        dateReport: {
            type: Date,
            required: true,
        },
        userReport: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        postReport: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;