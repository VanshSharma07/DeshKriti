import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, CircularProgress, InputBase, IconButton, useTheme } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';
import Navbar from '../social/components/Navbar';
import Header2 from '../components/Header2';

const API_KEY = '487e6669bbb240bc8a519d6f126354df';
const BASE_URL = 'https://newsapi.org/v2';

// Added Indian news sources
const INDIAN_SOURCES = 'the-times-of-india,the-hindu,india-today,ndtv-news';

const categories = [
  'general', 'business', 'technology', 'entertainment', 
  'health', 'science', 'sports'
];

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  const fetchNews = async (category = 'general', query = '') => {
    setLoading(true);
    try {
      let url;
      if (query) {
        url = `${BASE_URL}/everything?q=${query} AND India&apiKey=${API_KEY}&pageSize=20&language=en`;
      } else {
        // Modified to use everything endpoint with Indian sources and category
        url = `${BASE_URL}/everything?q=${category} AND India&domains=ndtv.com,indianexpress.com,timesofindia.indiatimes.com,thehindu.com&apiKey=${API_KEY}&pageSize=20&language=en&sortBy=publishedAt`;
      }
      
      const response = await axios.get(url);
      setNews(response.data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchNews('', searchQuery);
    }
  };

  return (
    <Box bgcolor={theme.palette.background.default}>
      <Header2 />
      <Navbar />
      <Box sx={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem',
        minHeight: '100vh',
        color: theme.palette.text.primary
      }}>
        {/* Search and Filter Section */}
        <Box sx={{ mb: 4 }}>
          <form onSubmit={handleSearch}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 3,
              backgroundColor: theme.palette.background.alt,
              padding: '0.5rem',
              borderRadius: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <InputBase
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ 
                  ml: 2, 
                  flex: 1,
                  color: theme.palette.text.primary
                }}
              />
              <IconButton 
                type="submit"
                sx={{ color: theme.palette.primary.main }}
              >
                <FaSearch />
              </IconButton>
            </Box>
          </form>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                onClick={() => setSelectedCategory(category)}
                color={selectedCategory === category ? 'primary' : 'default'}
                sx={{ 
                  borderRadius: '1rem',
                  '&:hover': { opacity: 0.8 },
                  backgroundColor: selectedCategory === category ? 
                    theme.palette.primary.main : 
                    theme.palette.background.alt,
                  color: selectedCategory === category ? 
                    '#fff' : 
                    theme.palette.text.primary,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* News Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 3 
          }}>
            {news.map((article, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: theme.palette.background.alt,
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                {article.urlToImage && (
                  <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/news-placeholder.jpg';
                      }}
                    />
                  </Box>
                )}
                <Box sx={{ p: 2 }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary" 
                    gutterBottom
                  >
                    {article.source.name} • {moment(article.publishedAt).fromNow()}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      color: theme.palette.text.primary
                    }}
                  >
                    {article.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                      color: theme.palette.text.secondary
                    }}
                  >
                    {article.description}
                  </Typography>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <Chip
                      label="Read More"
                      sx={{ 
                        borderRadius: '1rem',
                        cursor: 'pointer',
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                        '&:hover': { 
                          backgroundColor: theme.palette.primary.dark 
                        }
                      }}
                    />
                  </a>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default News; 