/* <----------------------- COMPONENTES --------------------------> */
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import ReportIcon from "@mui/icons-material/Report";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

/* <----------------------- FUNCIONES --------------------------> */
import { useState } from "react";

/* <----------------------- SERVICIOS  -----------------------> */
import { createReport } from "@/services/report.service.js";

/* <----------------------- CONTEXTO  -----------------------> */
import { useAuth } from "@/context/AuthContext.jsx";
/* <----------------------- ICONOS --------------------------> */

const CreateReport = ({ postId }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState({
    userReport: user.id,
    postReport: postId,
    contentReport: "",
    reportType: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const predefinedReport = [
    "Spam",
    "Fraude",
    "Informacion falsa",
    "Contenido ofensivo",
    "Contenido inapropiado",
  ];

  const handleInputChange = (e) => {
    setReport({
      ...report,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReport(report);
      setSnackbarMessage("Reporte enviado exitosamente.");
      setSnackbarSeverity("success");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al enviar el reporte. Intentelo nuevamente.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setReport({
        userReport: user.id,
        postReport: postId,
        contentReport: "",
        reportType: "",
      });
      handleClose();
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpen} aria-label="Reportar">
        <ReportIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Reportar publicación</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <select
                name="reportType"
                id="reportType"
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                {predefinedReport.map((reportType, index) => (
                  <option key={index} value={reportType}>
                    {reportType}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="contentReport"
                value={report.contentReport}
                onChange={handleInputChange}
                placeholder="Ingrese más información..."
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-zinc-300 hover:bg-neutral-400 text-black px-2 py-1 rounded"
              >
                Reportar
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="bg-red-300 hover:bg-red-500 text-white px-2 py-1 rounded ml-2"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateReport;
