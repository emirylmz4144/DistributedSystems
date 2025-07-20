// src/pages/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Avatar,
} from "@mui/material";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

function Register() {
  const [form, setForm] = useState({ username: "", password: "", role: "student" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/register", form);
      navigate("/login");
    } catch (err) {
      alert("Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, marginTop: 10, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "secondary.main", width: 56, height: 56 }}>
            <PersonAddAlt1Icon fontSize="large" />
          </Avatar>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Kayıt Ol
          </Typography>

          <Box component="form" onSubmit={handleSubmit} width="100%" mt={2}>
            <TextField
              label="Kullanıcı Adı"
              fullWidth
              margin="normal"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <TextField
              label="Şifre"
              type="password"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label">Rol</InputLabel>
              <Select
                labelId="role-select-label"
                value={form.role}
                label="Rol"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <MenuItem value="student">ÖĞRENCİ</MenuItem>
                <MenuItem value="instructor">AKADEMİSYEN</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ marginTop: 2 }}
            >
              Üye Ol
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
