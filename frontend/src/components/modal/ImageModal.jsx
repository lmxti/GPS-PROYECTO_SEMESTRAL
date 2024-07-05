import React, { useState, useEffect  } from 'react';

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

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (selectedImageIndex !== null) {
                if (event.key === 'ArrowRight') {
                    handleNextImage();
                } else if (event.key === 'ArrowLeft') {
                    handlePrevImage();
                } else if (event.key === 'Escape') {
                    handleCloseModal();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImageIndex]);


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
                    <div className="fixed inset-0 bg-black opacity-60" onClick={handleCloseModal}></div>
                    <div className="relative bg-white w-[600px]">
                        <div className="flex justify-between px-4 py-4">
                            <p className="font-thin text-2xl">Proyecto GPS</p>
                            <p onClick={handleCloseModal} className="bg-zinc-200 transition-colors cursor-pointer hover:bg-zinc-400 font-bold px-4 py-2 rounded-xl">&times;</p>
                        </div>

                        <div className="flex items-center justify-center p-4 w-[600px] h-[600px] relative">
                            { images.length  > 1 && (
                                <button onClick={handlePrevImage} className="h-3/4 absolute left-4 z-10 px-2 text-white rounded-full hover:bg-opacity-75">
                                    <svg className="w-5 h-5 rounded-full bg-zinc-400 text-white sm:w-9 sm:h-9 dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" strokeLinejoin stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                </button>
                            )}

                            <img src={images[selectedImageIndex]} alt="Full-size Image" className="w-full h-full object-contain" />

                            { images.length  > 1 && (
                                <button onClick={handleNextImage} className="h-3/4 absolute right-4 z-10 px-2 text-white rounded-full hover:bg-opacity-75">
                                    <svg className="w-5 h-5 rounded-full bg-zinc-400 text-white sm:w-9 sm:h-9 dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" strokeLinejoin stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            )}
                            
                        </div>
                    </div>
                </div>
            )}
            <div className={`grid ${calculateGridColumns(images.length)} gap-4`}>
                {images.map((imageUrl, index) => (
                    <img key={index} src={imageUrl} alt={`Thumbnail ${index}`} onClick={() => handleClickImage(index)} className="w-full h-full object-cover shadow-md cursor-pointer" />
                ))}
            </div>
        </>
    );
}

export default ImageModal;
