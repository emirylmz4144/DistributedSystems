import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import {
  Typography,
  CircularProgress,
  Box,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

// 📅 Tarihi Gün Ay Yıl - Saat:Dakika formatına çeviren yardımcı fonksiyon
function formatDate(timestamp) {
  if (!timestamp) return "Tarih bilinmiyor";

  const date = new Date(timestamp);
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Transactions() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== "instructor") {
      setError("Sadece akademisyenler işlem geçmişini görebilir.");
      setLoading(false);
      return;
    }

    axios.get("http://localhost:8000/transactions")
      .then(res => {
        setTransactions(res.data.transactions);
        setLoading(false);
      })
      .catch(() => {
        setError("İşlem verileri yüklenirken hata oluştu.");
        setLoading(false);
      });
  }, [user]);

  if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error" mt={4} textAlign="center">{error}</Typography>;

  if (transactions.length === 0)
    return <Typography mt={4} textAlign="center">Görüntülenecek işlem bulunamadı.</Typography>;

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {transactions.map((tx, index) => {
          const isSubmit = tx.type === "submit";
          const isApprove = tx.type === "approve";

          return (
            <Grid item xs={12} md={6} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {isSubmit ? "📝 Proje Teslimi" : isApprove ? "✅ Onaylama" : "🔔 Diğer"}
                    </Typography>
                  </Stack>

                  <Typography variant="body2" color="textSecondary">
                    <strong>Tarih:</strong> {formatDate(tx.timestamp)}
                  </Typography>

                  {isSubmit && tx.project && (
                    <>
                      <Typography variant="body2"><strong>Proje Başlığı:</strong> {tx.project.title}</Typography>
                      <Typography variant="body2"><strong>Açıklama:</strong> {tx.project.description}</Typography>
                      <Typography variant="body2"><strong>Proje Sahibi ID:</strong> {tx.project.owner_id}</Typography>
                      <Typography variant="body2"><strong>Danışman ID:</strong> {tx.project.instructor_id}</Typography>
                    </>
                  )}

                  {isApprove && (
                    <>
                      <Typography variant="body2"><strong>Onaylayan Kullanıcı ID:</strong> {tx.user}</Typography>
                      <Typography variant="body2"><strong>Proje ID:</strong> {tx.project_id}</Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Transactions;
