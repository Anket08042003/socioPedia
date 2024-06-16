import express from 'express';
import { getFeedPosts, getUserPosts, likePost, deletePost, addComment } from '../controllers/posts.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Read
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

//delete
router.delete("/:id", verifyToken, deletePost);

// Update
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:postId/comment", verifyToken, addComment);

export default router;