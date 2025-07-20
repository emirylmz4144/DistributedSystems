import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Alert } from '@mui/material';

const ChainValidation = () => {
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState('');

  const handleValidate = async () => {
    setError('');
    setIsValid(null);
    try {
      const response = await axios.get("http://localhost:8000/chain/validate");
      setIsValid(response.data.valid);
    } catch (err) {
      console.error(err);
      setError("Zincir doğrulanamadı.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, textAlign: 'center' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Blockchain Doğrulama
      </Typography>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleValidate}
        sx={{ mt: 3 }}
      >
        Zinciri Doğrula
      </Button>

      {isValid !== null && (
        <Alert severity={isValid ? "success" : "error"} sx={{ mt: 3 }}>
          {isValid ? "Zincir geçerli!" : "Zincir BOZULMUŞ!"}
        </Alert>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ChainValidation;
