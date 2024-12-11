import { useState, useEffect } from "react";
import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "/images/user.png";

  useEffect(() => {
    console.log('UserImage Component - Received Image Prop:', image);
  }, [image]);

  const getImageUrl = (image) => {
    console.log('GetImageUrl - Processing image:', {
      type: typeof image,
      value: image,
      isNull: image === null,
      isUndefined: image === undefined
    });

    if (!image) {
      console.log('GetImageUrl - No image provided, using fallback');
      return fallbackImage;
    }
    
    // Case 1: Image is a string URL
    if (typeof image === 'string') {
      console.log('GetImageUrl - Found string URL:', image);
      return image;
    }
    
    // Case 2: Image is an object with profilePicture
    if (image.profilePicture?.url) {
      console.log('GetImageUrl - Found profilePicture.url:', image.profilePicture.url);
      return image.profilePicture.url;
    }
    
    // Case 3: Image is an object with direct url property
    if (image.url) {
      console.log('GetImageUrl - Found direct url:', image.url);
      return image.url;
    }
    
    // Case 4: Image is a direct profilePicture object
    if (typeof image === 'object' && image.hasOwnProperty('url')) {
      console.log('GetImageUrl - Found object with url property:', image.url);
      return image.url;
    }

    console.log('GetImageUrl - No valid image format found, using fallback');
    return fallbackImage;
  };

  const finalUrl = getImageUrl(image);
  console.log('UserImage Component - Final URL:', finalUrl);

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
        src={imageError ? fallbackImage : finalUrl}
        onError={(e) => {
          console.error('Image load error:', {
            attemptedSrc: e.target.src,
            fallbackUsed: imageError
          });
          setImageError(true);
        }}
      />
    </Box>
  );
};

export default UserImage; 