import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box
} from "@mui/material";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/projects")
      .then(res => setProjects(res.data))
      .catch(err => console.error("Proje verileri alınamadı:", err));
  }, []);

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      {projects.map((p) => (
        <Card
          key={p.id}
          elevation={3}
          sx={{
            width: '100%',
            borderRadius: 0,
            mb: 2,
            px: 3,
            py: 2,
          }}
        >
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Sol kısım: Başlık + Açıklama */}
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {p.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {p.description}
              </Typography>
            </Box>

            {/* Sağ kısım: Durum */}
            <Chip
              icon={p.is_approved ? <CheckCircleIcon /> : <HourglassBottomIcon />}
              label={p.is_approved ? "Onaylandı" : "Beklemede"}
              color={p.is_approved ? "success" : "warning"}
              variant="outlined"
              sx={{ height: 40, fontSize: 14, mr: 3 }} // sağ boşluk
            />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default Projects;
