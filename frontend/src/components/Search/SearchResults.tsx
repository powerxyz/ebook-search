import React from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import BookCard from '../Books/BookCard';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  fileType?: string;
}

interface SearchResultsProps {
  results: Book[];
  loading: boolean;
  error: string | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography align="center" color="textSecondary">
          No books found. Try a different search term.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {results.map((book) => (
        <Grid item xs={12} sm={6} md={4} key={book.id}>
          <BookCard
            id={book.id}
            title={book.title}
            author={book.author}
            description={book.description}
            fileType={book.fileType}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default SearchResults; 