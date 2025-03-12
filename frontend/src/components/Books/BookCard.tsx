import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DescriptionIcon from '@mui/icons-material/Description';

interface BookProps {
  id: number;
  title: string;
  author: string;
  description: string;
  fileType?: string;
}

const BookCard: React.FC<BookProps> = ({ id, title, author, description, fileType }) => {
  const navigate = useNavigate();

  const handleViewBook = () => {
    navigate(`/books/${id}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <MenuBookIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2" noWrap>
            {title}
          </Typography>
        </Box>
        <Typography color="textSecondary" gutterBottom>
          {author}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          mb: 2
        }}>
          {description}
        </Typography>
        {fileType && (
          <Chip 
            icon={<DescriptionIcon />} 
            label={fileType.toUpperCase()} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        )}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleViewBook}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default BookCard; 