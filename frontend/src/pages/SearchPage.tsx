import React, { useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import SearchBar from '../components/Search/SearchBar';
import SearchResults from '../components/Search/SearchResults';
import axios from 'axios';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  fileType?: string;
}

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/books/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data.books || []);
    } catch (err) {
      setError('Failed to search books. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Search E-Books
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
            Search for books by title, author, or content
          </Typography>
          <SearchBar onSearch={handleSearch} />
        </Paper>

        {hasSearched && (
          <SearchResults 
            results={searchResults} 
            loading={loading} 
            error={error} 
          />
        )}
      </Box>
    </Container>
  );
};

export default SearchPage; 