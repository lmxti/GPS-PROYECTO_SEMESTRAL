import axios from "./root.service"

const headers = {
    "Content-Type": "application/json",
}

export const createReport = async (reportData) => {
    try{
        return axios.post("reports/createReport", reportData, { headers })
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> createReport",error);
    }
}

export const getReports = async () => {
    try {
        return axios.get("reports/getReports", { headers })
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> getReports",error);
    }
}

export const updateReportStatus = async (reportId, newStatus) => {
    try {
        return axios.put(`reports/updateReportStatus/${reportId}`, { newStatus }, { headers })
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> updateReportStatus",error);
    }
}