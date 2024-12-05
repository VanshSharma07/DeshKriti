import { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  ImageOutlined,
  DeleteOutline,
  EditOutlined,
  VideoCallOutlined,
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "./UserImage";
import WidgetWrapper from "./WidgetWrapper";
import { useSelector } from "react-redux";
import api from "../../api/api";
import LinearProgress from '@mui/material/LinearProgress';

const CreatePostWidget = ({ onPostCreated }) => {
  const [isMedia, setIsMedia] = useState(false);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [mediaFile, setMediaFile] = useState(null);
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const { palette } = useTheme();
  const currentUser = useSelector((state) => state.auth.userInfo);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch complete user data including profile picture
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/social/user/${currentUser.id}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (currentUser?.id) {
      fetchUserData();
    }
  }, [currentUser?.id]);

  console.log('CreatePostWidget - User Data:', {
    userData,
    profilePicture: userData?.profilePicture
  });

  const handlePost = async () => {
    if (!post.trim()) return;
    
    try {
        setLoading(true);
        let mediaUrl = null;
        
        // Handle media upload first if exists
        if (mediaFile) {
            try {
                const uploadResponse = await uploadLargeFile(mediaFile);
                console.log('Upload response:', uploadResponse); // Debug log
                mediaUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Media upload failed:", uploadError);
                setLoading(false);
                return;
            }
        }

        // Create post with media data
        const postData = {
            text: post.trim(),
            mediaUrl: mediaUrl,
            mediaType: mediaType
        };

        console.log('Sending post data:', postData); // Debug log

        const response = await api.post("/social/posts/create", postData);
        
        console.log('Post creation response:', response.data); // Debug log
        
        setPost("");
        setMediaFile(null);
        setIsMedia(false);
        setMediaType(null);
        setUploadProgress(0);
        
        if (onPostCreated) {
            onPostCreated(response.data.post);
        }
    } catch (error) {
        console.error("Error creating post:", error);
    } finally {
        setLoading(false);
    }
  };

  const uploadLargeFile = async (file) => {
    try {
        setUploadProgress(0);
        
        const formData = new FormData();
        formData.append('file', file);
        
        console.log('Uploading file:', file); // Debug log
        
        const response = await api.post('/social/upload-chunk', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percentCompleted);
            },
        });

        console.log('Upload response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error(error.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage 
          image={userData?.profilePicture}
          key={userData?.profilePicture?.url}
        />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isMedia && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles={mediaType === 'image' ? 
              {
                'image/*': ['.jpeg', '.jpg', '.png']
              } : 
              {
                'video/*': ['.mp4', '.mov', '.avi']
              }
            }
            multiple={false}
            onDrop={(acceptedFiles) => setMediaFile(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!mediaFile ? (
                    <p>Add {mediaType === 'image' ? 'Image' : 'Video'} Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{mediaFile.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {mediaFile && (
                  <IconButton
                    onClick={() => setMediaFile(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutline />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => {
          setIsMedia(true);
          setMediaType('image');
        }}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => {
          setIsMedia(true);
          setMediaType('video');
        }}>
          <VideoCallOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Video
          </Typography>
        </FlexBetween>

        {loading && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" color="text.secondary" align="center">
              {uploadProgress < 100 
                ? `Uploading... ${uploadProgress}%`
                : 'Processing...'
              }
            </Typography>
          </Box>
        )}

        <Button
          disabled={!post || loading}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            "&:hover": {
              backgroundColor: palette.primary.dark,
            },
          }}
        >
          {loading ? "Uploading..." : "POST"}
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default CreatePostWidget; 