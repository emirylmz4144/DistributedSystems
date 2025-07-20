// src/pages/Login.js
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login", {
        username,
        password,
      });
      login(response.data);
      navigate("/projects");
    } catch (error) {
      alert("Giriş başarısız. Lütfen kullanıcı adı ve şifrenizi kontrol edin.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, marginTop: 10, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Kullanıcı Girişi
          </Typography>

          <Box component="form" onSubmit={handleSubmit} width="100%" mt={2}>
            <TextField
              label="Kullanıcı Adı"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Şifre"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ marginTop: 2 }}
            >
              Giriş Yap
            </Button>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              sx={{ marginTop: 2 }}
              onClick={() => navigate("/register")}
            >
              Kayıt Ol
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
