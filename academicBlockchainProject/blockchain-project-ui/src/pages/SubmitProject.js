// src/pages/SubmitProject.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';

function SubmitProject() {
  const [form, setForm] = useState({ title: "", description: "", instructor_id: "" });
  const [instructors, setInstructors] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get("http://localhost:8000/instructors")
      .then(res => setInstructors(res.data))
      .catch(err => console.error("Akademisyen verisi alınamadı:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/projects", {
        ...form,
        owner_id: user.user_id,
      });
      alert("Proje başarıyla gönderildi.");
      setForm({ title: "", description: "", instructor_id: "" });
    } catch (error) {
      alert("Gönderim sırasında hata oluştu.");
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, marginTop: 10, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
            <AssignmentIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Proje Gönder
          </Typography>

          <Box component="form" onSubmit={handleSubmit} width="100%" mt={2}>
            <TextField
              label="Proje Başlığı"
              fullWidth
              margin="normal"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <TextField
              label="Açıklama"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="instructor-select-label">Akademisyen Seçiniz</InputLabel>
              <Select
                labelId="instructor-select-label"
                value={form.instructor_id}
                label="Akademisyen Seçiniz"
                onChange={(e) => setForm({ ...form, instructor_id: e.target.value })}
                required
              >
                {instructors.map(i => (
                  <MenuItem key={i.id} value={i.id}>
                    {i.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 2 }}
              size="large"
            >
              Gönder
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default SubmitProject;
