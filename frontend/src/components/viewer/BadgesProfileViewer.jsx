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
        <div className='flex flex-wrap justify-center gap-4'>
            {badgeList.length > 0 
                ? badgeList.map((badgeItem, index) => (
                        <div 
                            key={index}
                            className="flex items-center justify-center p-2"
                        >
                            <img 
                                src={`data:image/png;base64,${badgeItem.badge.imageBadge}`} 
                                alt={badgeItem.badge.nameBadge} 
                                className="w-24 h-24 p-2 rounded-3xl bg-zinc-100 hover:bg-zinc-200 object-contain mb-2 select-none"
                                title={`${badgeItem.badge.descriptionBadge}\nObtenida el ${formatDate(badgeItem.dateObtained)}`} 
                            />
                        </div>
                )) 
                : <p>No hay insignias para mostrar</p>
            }
        </div>
    );
}
