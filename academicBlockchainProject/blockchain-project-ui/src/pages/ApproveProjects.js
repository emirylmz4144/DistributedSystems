import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  CircularProgress,
  Alert
} from "@mui/material";

function ApproveProjects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/projects")
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Projeler yüklenirken hata oluştu.");
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id) => {
    try {
      setApproving(id);
      await axios.post(`http://localhost:8000/projects/${id}/approve?instructor_id=${user.user_id}`);
      alert("Proje onaylandı!");
      // Onaylanan projeyi listeden çıkaralım
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("Onaylama işlemi sırasında hata oluştu.");
    } finally {
      setApproving(null);
    }
  };

  if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;

  if (error) return <Alert severity="error">{error}</Alert>;

  const pendingProjects = projects.filter(p => !p.is_approved && p.instructor_id === user.user_id);

  if (pendingProjects.length === 0)
    return <Typography mt={4} textAlign="center">Onaylanacak proje yok.</Typography>;

  return (
    <Stack spacing={3} mt={3} mx="auto" maxWidth={600}>
      {pendingProjects.map(p => (
        <Card key={p.id} variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>{p.title}</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>{p.description}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleApprove(p.id)}
              disabled={approving === p.id}
            >
              {approving === p.id ? "Onaylanıyor..." : "Onayla"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

export default ApproveProjects;
