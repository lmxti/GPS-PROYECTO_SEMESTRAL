import React, { useEffect, useState } from 'react';

export default function BadgesProfileViewer({ badges }) {
    const [badgeList, setBadgeList] = useState([]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan desde 0 en JavaScript
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

    useEffect(() => {
        setBadgeList(badges);
    }, [badges]);

    return (
        <div>
            {badgeList && badgeList.length > 0 
                ? badgeList.map((badge, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <img src={`data:image/png;base64,${badge.imageBadge}`} alt={badge.nameBadge} className="w-36 h-w-36 p-4 rounded-3xl bg-zinc-200 object-scale-down mb-2 select-none" 
                            title={`${badge.descriptionBadge}\nObtenida el ${formatDate(badge.dateObtained)}`} />
                    </div>
                )) : <p>No hay insignias para mostrar</p>
            }
        </div>
    );
}
