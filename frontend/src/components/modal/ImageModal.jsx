import React, { useState } from 'react';

const ImageModal = ({ images }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const handleClickImage = (index) => {
        setSelectedImageIndex(index);
    };

    const handleCloseModal = () => {
        setSelectedImageIndex(null);
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const calculateGridColumns = (imageCount) => {
        if (imageCount === 1) {
            return 'grid-cols-1';
        } else if (imageCount === 2) {
            return 'grid-cols-2';
        } else if (imageCount === 4) {
            return 'grid-cols-2'; // Para mostrar 4 imágenes en una cuadrícula de 2x2
        } else {
            return 'grid-cols-4'; // O cualquier otro valor predeterminado
        }
    };

    return (
        <>
            {selectedImageIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black opacity-80" onClick={handleCloseModal}></div>
                    <div className="relative w-[600px] h-[600px] bg-white p-4">
                        <span className="absolute top-0 -right-14 cursor-pointer text-3xl bg-white rounded px-3 py-2" onClick={handleCloseModal}>&times;</span>
                        <img src={images[selectedImageIndex]} alt="Full-size Image" className="w-full h-full object-contain" />
                        {images.length > 1 && (
                            <>
                                <button onClick={handlePrevImage} className="absolute top-1/2 -left-24 transform -translate-y-1/2 bg-white p-2 rounded">Anterior</button>
                                <button onClick={handleNextImage} className="absolute top-1/2 -right-24 transform -translate-y-1/2 bg-white p-2 rounded">Siguiente</button>
                            </>
                        )}
                    </div>
                </div>
            )}
            <div className={`grid ${calculateGridColumns(images.length)} gap-4`}>
                {images.map((imageUrl, index) => (
                    <img key={index} src={imageUrl} alt={`Thumbnail ${index}`} onClick={() => handleClickImage(index)} className="w-full h-full object-cover p-1 bg-slate-200 shadow-md cursor-pointer" />
                ))}
            </div>
        </>
    );
}

export default ImageModal;
