"use strict";

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        contentComment: {
            type: String,
            required: true,
        },
        ImageComment: {
            type: String,
        },
        fileComment: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        createdAt: {
            type: Date,
            required: true,
        }
    }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;