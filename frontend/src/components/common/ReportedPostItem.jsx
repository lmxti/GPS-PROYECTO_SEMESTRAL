import React, { useState } from "react";
import { useRouter } from "next/router";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { updateReportStatus } from "@/services/report.service.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";

export default function ReportedPostItem({ post, updatePosts }) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date,"d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
  };

  const changeReportStatus = async (postId, newStatus) => {
    try {
      await updateReportStatus(postId, newStatus);
      updatePosts();
    } catch (error) {
      console.error("Error al actualizar el estado del reporte:", error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={showPreview ? 7 : 12}>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Publicacion</TableCell>
                <TableCell>Razon</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Avatar
                      src={post.author.image}
                      alt={`${post.author.name} ${post.author.surname}`}
                      sx={{ cursor: "pointer" }}
                      onClick={() => router.push(`/profile/${post.author._id}`)}
                    />
                    <div>
                      <Typography variant="body1">
                        {post.author.name} {post.author.surname}
                      </Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body1"
                    sx={{ cursor: "pointer", fontWeight: "medium" }}
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {post.title}
                  </Typography>
                </TableCell>
                <TableCell>{post.reportInfo.reportType || "Not specified"}</TableCell>
                <TableCell>{formatDate(post.reportInfo.dateReport)}</TableCell>
                <TableCell>
                  <Select
                    value={post.reportInfo.statusReport}
                    onChange={(e) => changeReportStatus(post.reportInfo.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="pendiente">Pendiente</MenuItem>
                    <MenuItem value="resuelto">Resuelto</MenuItem>
                    <MenuItem value="cerrado">Cerrado</MenuItem>
                    <MenuItem value="en revision">En revisión</MenuItem>
                    <MenuItem value="rechazado">Rechazado</MenuItem>
                    <MenuItem value="en espera">En espera</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => changeReportStatus(post.reportInfo.id, "resuelto")}
                    size="small"
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => changeReportStatus(post.reportInfo.id, "rechazado")}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {showPreview && (
        <Grid item xs={12} md={4} gap={2}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{ cursor: "pointer" }} onClick={() => router.push(`/post/${post.id}`)}>
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.description}
                {post.images && post.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="140"
                  image={post.images[0]}
                  alt={post.title}
                  sx={{ mt: 2 }}
                />
                )}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                Reportado por: {post.reportInfo.userReport.name} {post.reportInfo.userReport.surname}
              </Typography>
              <Typography variant="caption" display="block">
                Fecha del reporte: {formatDate(post.reportInfo.dateReport)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}