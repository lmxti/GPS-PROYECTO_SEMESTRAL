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