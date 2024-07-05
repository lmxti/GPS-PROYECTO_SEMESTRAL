/* <----------------------- COMPONENTES --------------------------> */
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import ReportIcon from "@mui/icons-material/Report";

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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReport(report);
    } catch (error) {
      console.log(error);
    } finally {
      setReport({
        userReport: user.id,
        postReport: postId,
        contentReport: "",
        reportType: "",
      });
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="mr-2"
              >
                Reportar
              </Button>
              <Button
                onClick={handleClose}
                variant="outlined"
                color="secondary"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateReport;
