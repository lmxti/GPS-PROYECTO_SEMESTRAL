import React, { useState } from "react";
import UserAvatar from "./UserAvatar.jsx";
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/router";
import { updateReportStatus } from "@/services/report.service.js";

export default function ReportedPostItem({ post, updatePosts }) {
  const router = useRouter();

  const formatRelativeDate = (dateString) => {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
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
    <div key={post.id} className="border p-4 rounded">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p
            className="text-lg font-bold text-slate-700 cursor-pointer"
            onClick={() => router.push(`/post/${post.id}`)}
          >
            {post.title}
          </p>
          <p className="text-sm text-gray-500">
            {formatRelativeDate(post.createdAt)}
          </p>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => router.push(`/profile/${post.author._id}`)}
        >
          <UserAvatar userId={post.author._id} />
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">{post.description}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Reportado por {post.author.name}
        </p>
        <select
          value={post.reportInfo.statusReport}
          onChange={(e) =>
            changeReportStatus(post.reportInfo.id, e.target.value)
          }
          className="p-2 border rounded"
        >
          <option value="pendiente">Pendiente</option>
          <option value="resuelto">Resuelto</option>
          <option value="cerrado">Cerrado</option>
          <option value="en revision">En revisión</option>
          <option value="rechazado">Rechazado</option>
          <option value="en espera">En espera</option>
        </select>
      </div>
    </div>
  );
}
