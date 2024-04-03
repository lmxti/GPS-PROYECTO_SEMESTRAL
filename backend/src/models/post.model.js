"use strict";

const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        /*image: {
            type: String,
            required: true,
        },*/
        createdAt: {
            type: Date,
            required: true,
        },
        hashtags: [
            {
                type: String,
            },
        ],
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ]
    }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;