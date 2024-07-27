/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";

/* <------------------- COMPONENTES COMMON ---------------------> */
import ReportedPostItem from "../common/ReportedPostItem.jsx";

/* <----------------------- SERVICIOS  -------------------------> */
import { getReports } from "@/services/report.service.js";

const ReportedPostsViewer = ({ userId }) => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [options, setOptions] = useState({
    show_images: true,
    show_hashtags: true,
    show_interactions: true,
    show_icon_comments: true,
    show_comments: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportTypeFilter, setReportTypeFilter] = useState("");
  const [reportStatusFilter, setReportStatusFilter] = useState("");
  const [sortField, setSortField] = useState("date_desc");

  const getReportedPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getReports();
      console.log(response);
      if (Array.isArray(response.data.data.data)) {
        const seen = new Set();
        const reportedPostsData = response.data.data.data
          .filter((report) => {
            const id = report._id;
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
          })
          .map((report) => ({
            id: report.postReport._id,
            title: report.postReport.title,
            description: report.postReport.description,
            images: report.postReport.images,
            status: report.postReport.status,
            author: report.postReport.author,
            hashtags: report.postReport.hashtags,
            createdAt: report.postReport.createdAt,
            interactions: report.postReport.interactions,
            comments: report.postReport.comments,
            reportInfo: {
              id: report._id,
              reportType: report.reportType,
              contentReport: report.contentReport,
              dateReport: report.dateReport,
              statusReport: report.statusReport,
              userReport: {
                id: report.userReport._id,
                name: report.userReport.name,
                surname: report.userReport.surname,
                username: report.userReport.username,
                image: report.userReport.profilePicture,
              },
            },
          }));
        setReportedPosts(reportedPostsData);
      } else {
        setError("La respuesta no contiene un array de reportes");
      }
    } catch (error) {
      setError("Error al obtener los reportes: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getReportedPosts();
  }, []);

  const updatePosts = () => {
    getReportedPosts();
  };

  const filteredPosts = reportedPosts.filter((post) => {
    const typeFilter = reportTypeFilter === "" || post.reportInfo.reportType.toLowerCase() === reportTypeFilter.toLowerCase();
    const statusFilter = reportStatusFilter === "" || post.reportInfo.statusReport.toLowerCase() === reportStatusFilter.toLowerCase();
    return typeFilter && statusFilter;
  });

  const sortedPosts = filteredPosts.sort((a, b) => {
    if (sortField === "date_asc") {
      return new Date(a.dateReport) - new Date(b.dateReport);
    } else if (sortField === "date_desc") {
      return new Date(b.dateReport) - new Date(a.dateReport);
    }
    return 0;
  });

  if (isLoading) return <div>Cargando reportes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="reported-posts-viewer">
      <div className="filters mb-4 grid grid-cols-3 gap-4">
        <select
          value={reportTypeFilter}
          onChange={(e) => setReportTypeFilter(e.target.value.toLowerCase())}
          className="p-2 border rounded"
        >
          <option value="">Filtrar por tipo de reporte</option>
          {["Spam", "Fraude", "Informacion falsa", "Contenido ofensivo", "Contenido inapropiado"].map(
            (type) => (
              <option key={type} value={type.toLowerCase()}>
                {type}
              </option>
            )
          )}
        </select>
        <select
          value={reportStatusFilter}
          onChange={(e) => setReportStatusFilter(e.target.value.toLowerCase())}
          className="p-2 border rounded"
        >
          <option value="">Filtrar por estado de reporte</option>
          {["Pendiente", "Resuelto", "Cerrado", "En revision", "Rechazado", "En espera"].map(
            (status) => (
              <option key={status} value={status.toLowerCase()}>
                {status}
              </option>
            )
          )}
        </select>
      </div>
      {sortedPosts.length === 0 ? (
        <p>No hay posts reportados.</p>
      ) : (
        sortedPosts.map((post) => (
          <ReportedPostItem
            key={post.id}
            post={post}
            updatePosts={updatePosts}
            userId={userId}
            options={options}
          />
        ))
      )}
    </div>
  );
};

export default ReportedPostsViewer;
