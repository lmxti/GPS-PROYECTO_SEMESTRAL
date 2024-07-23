import React, { useEffect, useState } from 'react';

export default function BadgesProfileViewer({ badges }) {
    const [badgeList, setBadgeList] = useState([]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        const badgesArray = Object.values(badges).filter(badge => badge.badge);
        setBadgeList(badgesArray);
    }, [badges]);

    return (
        <div className='flex justify-center gap-2'>
            {badgeList.length > 0 
                ? badgeList.map((badgeItem, index) => (
                        <img 
                            key={index}
                            src={`data:image/png;base64,${badgeItem.badge.imageBadge}`} 
                            alt={badgeItem.badge.nameBadge} 
                            className="w-36 h-w-36 p-4 rounded-3xl bg-zinc-100 hover:bg-zinc-200 object-scale-down mb-2 select-none"
                            title={`${badgeItem.badge.descriptionBadge}\nObtenida el ${formatDate(badgeItem.dateObtained)}`} 
                        />
                )) 
                : <p>No hay insignias para mostrar</p>
            }
        </div>
    );
}