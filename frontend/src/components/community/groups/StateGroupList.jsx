import React, { useState, useContext } from 'react';
import { FaUsers, FaArrowRight, FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Box, Typography, useTheme } from '@mui/material';

// Static data for sub-groups
const stateSubGroups = {
  'Jammu and Kashmir': [
    {
      name: "Dogras",
      members: 1200,
      discussions: 45,
      description: "Community for Dogra culture and heritage"
    },
    {
      name: "Rajputana",
      members: 890,
      discussions: 32,
      description: "Group for Rajput history and traditions"
    },
    {
      name: "Kashmiri Pandits",
      members: 1500,
      discussions: 56,
      description: "Forum for Kashmiri Pandit community"
    }
  ],
  'Punjab': [
    {
      name: "Jatt Community",
      members: 2000,
      discussions: 78,
      description: "Group for Punjab's Jatt community"
    },
    {
      name: "Punjabi Artists",
      members: 1600,
      discussions: 89,
      description: "Platform for Punjabi art and culture"
    }
  ],
  'Himachal Pradesh': [
    {
      name: "Pahadi Culture Group",
      members: 980,
      discussions: 37,
      description: "Discussion forum for Pahadi culture and traditions"
    },
    {
      name: "Kullu Valley Heritage",
      members: 670,
      discussions: 21,
      description: "Community focused on the heritage of Kullu Valley"
    }
  ],
  'Rajasthan': [
    {
      name: "Marwari Culture",
      members: 2500,
      discussions: 110,
      description: "Forum for Marwari traditions and business community"
    },
    {
      name: "Rajasthani Folk Artists",
      members: 1400,
      discussions: 65,
      description: "Group celebrating Rajasthani folk art and music"
    }
  ],
  'Uttar Pradesh': [
    {
      name: "Awadhi Community",
      members: 3000,
      discussions: 120,
      description: "Group for preserving Awadhi culture and language"
    },
    {
      name: "Banarasi Weavers",
      members: 2100,
      discussions: 90,
      description: "Community for Banarasi weaving and craftsmanship"
    }
  ],
  'Maharashtra': [
    {
      name: "Maratha Warriors",
      members: 3500,
      discussions: 150,
      description: "Forum for Maratha history and culture"
    },
    {
      name: "Mumbai Artists Hub",
      members: 2200,
      discussions: 95,
      description: "Platform for artists and cultural enthusiasts in Mumbai"
    }
  ],
  'Gujarat': [
    {
      name: "Gujarati Entrepreneurs",
      members: 2700,
      discussions: 130,
      description: "Group for business and entrepreneurial discussions"
    },
    {
      name: "Garba & Dandiya Lovers",
      members: 1900,
      discussions: 80,
      description: "Community for Garba and Dandiya enthusiasts"
    }
  ],
  'West Bengal': [
    {
      name: "Bengali Literature Lovers",
      members: 3200,
      discussions: 140,
      description: "Forum for discussions on Bengali literature and poetry"
    },
    {
      name: "Durga Puja Organizers",
      members: 2600,
      discussions: 120,
      description: "Group for Durga Puja planning and celebration"
    }
  ],
  'Tamil Nadu': [
    {
      name: "Tamil Classical Arts",
      members: 3100,
      discussions: 145,
      description: "Forum for Carnatic music and Bharatanatyam enthusiasts"
    },
    {
      name: "Kanchipuram Weavers",
      members: 2000,
      discussions: 100,
      description: "Community of weavers and enthusiasts of Kanchipuram sarees"
    }
  ],
  'Kerala': [
    {
      name: "Malayali Diaspora",
      members: 2900,
      discussions: 125,
      description: "Group for Malayalis across the globe"
    },
    {
      name: "Kathakali & Mohiniyattam",
      members: 1700,
      discussions: 75,
      description: "Community for traditional Kerala dance forms"
    }
  ],
  'Karnataka': [
    {
      name: "Kannada Writers Forum",
      members: 2500,
      discussions: 115,
      description: "Group for Kannada literature and authors"
    },
    {
      name: "Bangalore Techies",
      members: 4200,
      discussions: 160,
      description: "Community for tech enthusiasts and professionals in Bangalore"
    }
  ],
  'Andhra Pradesh': [
    {
      name: "Telugu Film Fans",
      members: 4000,
      discussions: 180,
      description: "Forum for fans of Telugu movies and stars"
    },
    {
      name: "Andhra Crafts Hub",
      members: 2100,
      discussions: 85,
      description: "Group for promoting Andhra Pradesh's handicrafts"
    }
  ],
  'Assam': [
    {
      name: "Assamese Tea Gardeners",
      members: 1500,
      discussions: 60,
      description: "Forum for tea garden workers and enthusiasts"
    },
    {
      name: "Bihu Dance Lovers",
      members: 1800,
      discussions: 70,
      description: "Community for fans of the Bihu dance and festival"
    }
  ],
  'Odisha': [
    {
      name: "Odissi Dance Forum",
      members: 1400,
      discussions: 65,
      description: "Group for Odissi dancers and fans"
    },
    {
      name: "Puri Jagannath Devotees",
      members: 2700,
      discussions: 110,
      description: "Community for devotees of Lord Jagannath"
    }
  ]
  // Add more states as needed
};

// Add static images for states
const stateImages = {
  'Jammu and Kashmir': 'https://i.ytimg.com/vi/wT4UuRm6Me0/maxresdefault.jpg',
  'Punjab': 'https://cdn.britannica.com/53/176353-050-5B854179/Harmandir-Sahib-Amritsar-Punjab-India.jpg',
  'Himachal Pradesh': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23',
  'Rajasthan': 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
  'Uttar Pradesh': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da',
  'Maharashtra': 'https://images.unsplash.com/photo-1562979314-bee7453e911c',
  'Gujarat': 'https://images.unsplash.com/photo-1599030737039-9fb6165de6f0',
  'West Bengal': 'https://images.unsplash.com/photo-1558431382-27e303142255',
  'Tamil Nadu': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220',
  'Kerala': 'https://images.unsplash.com/photo-16023054901921-c6de9e4e7bab',
  'Karnataka': 'https://images.unsplash.com/photo-1600453265060-8097adbb4396',
  'Andhra Pradesh': 'https://images.unsplash.com/photo-1623070869780-96d65a4fd4e9',
  'Assam': 'https://images.unsplash.com/photo-1623070734874-fa0e6e2f1d89',
  'Odisha': 'https://images.unsplash.com/photo-1623070850278-7c3c6b6d9696'
};

const StateGroupList = () => {
  const [expandedState, setExpandedState] = useState(null);
  const theme = useTheme();

  const handleStateClick = (stateName) => {
    setExpandedState(expandedState === stateName ? null : stateName);
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        py: 6,
        px: 3,
        bgcolor: theme.palette.background.default
      }}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <Typography 
          variant="h2" 
          sx={{ 
            mb: 6, 
            textAlign: 'center',
            color: theme.palette.text.primary,
            fontWeight: 'bold'
          }}
        >
          Explore Indian State Communities
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          },
          gap: 4
        }}>
          {Object.entries(stateSubGroups).map(([stateName, subGroups]) => (
            <Box
              key={stateName}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: 3,
                transition: 'all 0.3s',
                transform: 'translateY(0)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                },
                bgcolor: theme.palette.background.alt
              }}
            >
              {/* State Card Image */}
              <Box sx={{ position: 'relative', height: '200px' }}>
                <Box
                  component="img"
                  src={stateImages[stateName]}
                  alt={stateName}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(0,0,0,0.4)',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.3)'
                  }
                }} />
                <Typography
                  variant="h4"
                  sx={{
                    position: 'absolute',
                    bottom: 2,
                    left: 2,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {stateName}
                </Typography>
              </Box>

              {/* State Card Content */}
              <Box sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography sx={{ color: theme.palette.text.secondary }}>
                    {subGroups.length} Communities
                  </Typography>
                  <Box
                    component="button"
                    onClick={() => handleStateClick(stateName)}
                    sx={{
                      color: theme.palette.primary.main,
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                      '&:hover': {
                        color: theme.palette.primary.dark
                      }
                    }}
                  >
                    <FaArrowRight style={{
                      transform: expandedState === stateName ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.3s'
                    }} />
                  </Box>
                </Box>

                {/* Subgroups Preview */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {(expandedState === stateName ? subGroups : subGroups.slice(0, 2)).map((subGroup) => (
                    <Link
                      key={subGroup.name}
                      to={`/discussions/${subGroup.name}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: theme.palette.background.default,
                        transition: 'background-color 0.3s',
                        '&:hover': {
                          bgcolor: theme.palette.primary.light
                        }
                      }}>
                        <Typography 
                          variant="h6"
                          sx={{ 
                            color: theme.palette.text.primary,
                            fontWeight: 'medium'
                          }}
                        >
                          {subGroup.name}
                        </Typography>
                        <Typography 
                          variant="body2"
                          sx={{ 
                            mt: 1,
                            color: theme.palette.text.secondary
                          }}
                        >
                          {subGroup.description}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex',
                          gap: 2,
                          mt: 1,
                          color: theme.palette.text.secondary
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FaUsers /> {subGroup.members}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FaComments /> {subGroup.discussions}
                          </Box>
                        </Box>
                      </Box>
                    </Link>
                  ))}
                </Box>

                {/* Show More Button */}
                {subGroups.length > 2 && expandedState !== stateName && (
                  <Box
                    component="button"
                    onClick={() => handleStateClick(stateName)}
                    sx={{
                      width: '100%',
                      mt: 2,
                      py: 1,
                      border: 'none',
                      background: 'none',
                      color: theme.palette.primary.main,
                      cursor: 'pointer',
                      fontWeight: 'medium',
                      '&:hover': {
                        color: theme.palette.primary.dark
                      }
                    }}
                  >
                    Show More Communities
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StateGroupList;