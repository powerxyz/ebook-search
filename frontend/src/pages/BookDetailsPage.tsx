import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import axios from 'axios';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  fileType?: string;
  filePath?: string;
  uploadDate?: string;
  fileSize?: number;
}

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBook(response.data.book);
        setError(null);
      } catch (err) {
        setError('Failed to load book details. Please try again.');
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/books/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${book?.title}.${book?.fileType}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download the book. Please try again.');
    }
  };

  const handleViewOnline = () => {
    navigate(`/books/${id}/read`);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">{error || 'Book not found'}</Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)} 
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)} 
          sx={{ mb: 2 }}
        >
          Back to Search
        </Button>
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <MenuBookIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" component="h1">
              {book.title}
            </Typography>
          </Box>
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            by {book.author}
          </Typography>
          
          {book.fileType && (
            <Chip 
              label={book.fileType.toUpperCase()} 
              color="primary" 
              size="small" 
              sx={{ mb: 2 }}
            />
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" paragraph>
            {book.description}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              {book.uploadDate && (
                <Typography variant="body2" color="text.secondary">
                  Uploaded: {new Date(book.uploadDate).toLocaleDateString()}
                </Typography>
              )}
              {book.fileSize && (
                <Typography variant="body2" color="text.secondary">
                  Size: {Math.round(book.fileSize / 1024)} KB
                </Typography>
              )}
            </Box>
            
            <Box>
              <Button 
                variant="contained" 
                startIcon={<DownloadIcon />} 
                onClick={handleDownload}
                sx={{ mr: 1 }}
              >
                Download
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<MenuBookIcon />} 
                onClick={handleViewOnline}
              >
                Read Online
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default BookDetailsPage; 