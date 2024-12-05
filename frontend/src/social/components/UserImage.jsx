import { useState } from "react";
import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "/images/user.png";

  // Determine the image path based on the image prop structure
  const getImagePath = (image) => {
    if (!image) return fallbackImage;
    
    // Handle object with url property
    if (typeof image === 'object' && image.url) {
      return image.url;
    }
    
    // Handle string path
    if (typeof image === 'string') {
      if (image.startsWith('http') || image.startsWith('/')) {
        return image;
      }
      return `/images/${image}`;
    }
    
    return fallbackImage;
  };

  const imagePath = getImagePath(image);

  return (
    <Box width={size} height={size}>
      <img
        style={{
          objectFit: "cover",
          borderRadius: "50%",
          width: size,
          height: size,
        }}
        alt="user"
        src={imageError ? fallbackImage : imagePath}
        onError={() => setImageError(true)}
      />
    </Box>
  );
};

export default UserImage; 