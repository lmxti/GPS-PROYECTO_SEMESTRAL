/* <----------------------- COMPONENTES --------------------------> */
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

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
            <Button onClick={handleOpen}>Reportar</Button>
            <Modal open={open} onClose={handleClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                    <form onSubmit={onSubmit}>
                        <select name="reportType" id="reportType" onChange={handleInputChange}>
                            {predefinedReport.map((reportType, index) => (
                                <option key={index} value={reportType}>
                                    {reportType}
                                </option>
                            ))}
                        </select>
                        <br />
                        <input
                            type="text"
                            name="contentReport"
                            value={report.contentReport}
                            onChange={handleInputChange}
                            placeholder="Ingrese más información..."
                        />
                        <br />
                        <Button type="submit">Reportar</Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default CreateReport;
