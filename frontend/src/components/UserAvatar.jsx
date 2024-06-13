import { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import { getUserImage } from "../services/user.service.js"

const UserAvatar = ({ userId }) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const response = await getUserImage(userId);
        setImage(response);
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    fetchUserImage();
  }, [userId]);

  return (
    <Avatar src={image} />
  );
};

export default UserAvatar;
