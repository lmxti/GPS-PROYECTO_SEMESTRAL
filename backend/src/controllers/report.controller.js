const ReportService = require('../services/report.service');
const { respondSuccess, respondError } = require('../utils/resHandler');
const { handleError } = require('../utils/errorHandler');


async function createReport(req, res) {
    try {
        const { body } = req;
        const [newReport, reportError] = await ReportService.createReport(body);
        if (reportError) return respondError(req, res, 400, reportError);
        if (!newReport) return respondError(req, res, 400, 'No se creo el reporte');
        respondSuccess(req, res, 201, newReport);
    } catch (error) {
        handleError(error, 'report.controller -> createReport');
        respondError(req, res, 500, 'No se creo reporte');
    }
}

async function getReports(req, res) {
    try {
        const [reports, errorReports] = await ReportService.getReports();
        if (errorReports) return respondError(res, 500, 'Error al buscar reportes');
        reports.length === 0
            ? respondSuccess(req, res, 200, 'No existen reportes en la bbdd')
            : respondSuccess(req, res, 200, { message: 'Se encontraron los siguientes reportes: ', data: reports });
    } catch (error) {
        handleError(error, 'report.controller -> getReports');
        respondError(req, res, 500, 'No se pudo encontrar reportes');
    }
}

async function getReport(req, res) {
    try {
        const { params } = req;
        const [report, reportError] = await ReportService.getReport(params.id);
        if (reportError) return respondError(req, res, 404, reportError);
        respondSuccess(req, res, 200, report);
    } catch (error) {
        handleError(error, 'report.controller -> getReport');
        respondError(req, res, 500, 'No se pudo encontrar reporte');
    }
}

async function updateReport(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const [report, reportError] = await ReportService.updateReport(id, body);
        if (reportError) return respondError(req, res, 400, reportError);
        if (!report) return respondError(req, res, 400, 'No se encontro reporte asociado al id ingresado');
        respondSuccess(req, res, 200, { message: 'Reporte actualizado', data: report });
    } catch (error) {
        handleError(error, 'report.controller -> updateReport');
        respondError(req, res, 500, 'No se pudo actualizar reporte');
    }
}

async function deleteReport(req, res) {
    try {
        const { id } = req.params;
        const [report, reportError] = await ReportService.deleteReport(id);
        if (reportError) return respondError(req, res, 400, reportError);
        if (!report) return respondError(req, res, 400, 'No se encontro reporte asociado al id ingresado');
        respondSuccess(req, res, 200, { message: 'Reporte eliminado', data: report });
    } catch (error) {
        handleError(error, 'report.controller -> deleteReport');
        respondError(req, res, 500, 'No se pudo eliminar reporte');
    }
}

async function getReportsByUser(req, res) {
    try {
        const { params } = req;
        const [reports, errorReports] = await ReportService.getReportsByUser(params.id);
        if (errorReports) return respondError(req, res, 404, errorReports);
        respondSuccess(req, res, 200, reports);
    } catch (error) {
        handleError(error, 'report.controller -> getReportsByUser');
        respondError(req, res, 500, 'No se pudo encontrar reportes');
    }
}

async function getReportsByPost(req, res) {
    try {
        const { params } = req;
        const [reports, errorReports] = await ReportService.getReportsByPost(params.id);
        if (errorReports) return respondError(req, res, 404, errorReports);
        respondSuccess(req, res, 200, reports);
    } catch (error) {
        handleError(error, 'report.controller -> getReportsByPost');
        respondError(req, res, 500, 'No se pudo encontrar reportes');
    }
}

async function getReportsByType(req, res) {
    try {
        const { params } = req;
        const [reports, errorReports] = await ReportService.getReportsByType(params.reportType);
        if (errorReports) return respondError(req, res, 404, errorReports);
        respondSuccess(req, res, 200, reports);
    } catch (error) {
        handleError(error, 'report.controller -> getReportsByType');
        respondError(req, res, 500, 'No se pudo encontrar reportes');
    }
}

async function updateReportStatus(req, res){
    try {
        const {id} = req.params;
        const {newStatus, reviewNotes} = req.body;
        const [updateReport, error] = await ReportService.updateReportStatus(id, newStatus, reviewNotes);
        if(error) return respondError(req, res, 400, error);
        if(!updateReport) return respondError(req, res, 404, 'Reporte no encontrado');
        respondSuccess(req, res, 200, {message: 'Reporte actualizado', data: updateReport});
    } catch (error) {
        handleError(error, 'report.controller -> updateReportStatus');
        respondError(req, res, 500, 'No se pudo actualizar el reporte');
    }
}

module.exports = {
    createReport,
    getReports,
    getReport,
    updateReport,
    deleteReport,
    getReportsByUser,
    getReportsByPost,
    getReportsByType,
    updateReportStatus
};