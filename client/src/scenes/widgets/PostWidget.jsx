import React, { useState } from 'react';
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, TextField, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost, deletePost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  isProfile
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleDelete = async () => {
    try {
        const response = await fetch(`http://localhost:3001/posts/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json();
        if (result.success) {
            dispatch(deletePost({ postId }));
            console.log("Post deleted successfully");
        } else {
            console.error("Failed to delete post");
        }
    } catch (error) {
        console.error("Error deleting post:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, comment: newComment }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setNewComment('');
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween gap="1rem">
          <IconButton>
            <ShareOutlined />
          </IconButton>
          {isProfile && (
            <IconButton onClick={handleDelete}>
              <DeleteOutline />
            </IconButton>
          )}
        </FlexBetween>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${comment.userId}-${i}`} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment.comment}
              </Typography>
            </Box>
          ))}
          <Divider />
          <form onSubmit={handleCommentSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mt: "1rem" }}
            />
            <Button type="submit" variant="contained" sx={{ mt: "1rem" }}>
              Comment
            </Button>
          </form>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
