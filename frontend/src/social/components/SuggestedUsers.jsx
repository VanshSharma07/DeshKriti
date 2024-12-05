import { Box, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "./WidgetWrapper";
import { useEffect, useState } from "react";
import api from "../../api/api";
import Friend from "./Friend";

const SuggestedUsers = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { palette } = useTheme();

  const getSuggestions = async () => {
    try {
      const response = await api.get("/social/suggestions");
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSuggestions();
  }, []);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Suggested For You
      </Typography>
      <Box 
        display="flex" 
        flexDirection="column" 
        gap="1.5rem"
        sx={{
          maxHeight: "400px", // Fixed height
          overflowY: "auto", // Enable vertical scrolling
          "&::-webkit-scrollbar": {
            width: "8px"
          },
          "&::-webkit-scrollbar-track": {
            background: palette.background.alt
          },
          "&::-webkit-scrollbar-thumb": {
            background: palette.neutral.medium,
            borderRadius: "4px"
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: palette.neutral.mediumMain
          }
        }}
      >
        {loading ? (
          <Typography color={palette.neutral.medium}>Loading...</Typography>
        ) : suggestions.length > 0 ? (
          suggestions.map((user) => (
            <Friend
              key={user._id}
              friendId={user._id}
              name={`${user.firstName} ${user.lastName}`}
              subtitle={user.location}
              userPicturePath={user.image}
              isSuggestion={true}
            />
          ))
        ) : (
          <Typography color={palette.neutral.medium}>
            No suggestions available
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default SuggestedUsers; 