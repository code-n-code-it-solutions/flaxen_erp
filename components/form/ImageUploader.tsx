import React, { ChangeEvent, useEffect, useState } from 'react';
import Image from "next/image";
import styles from './ImageUploader.module.css'; // Assuming you will create this CSS module

interface ImageUploaderProps {
    image: File | null;
    setImage: (file: File | null) => void;
    label?: string;
    existingImage?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, setImage, label, existingImage }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            // Create a blob URL for the file
            const blobUrl = URL.createObjectURL(file);
            setPreview(blobUrl);
        } else {
            setImage(null);
            setPreview(null);
        }
    };

    useEffect(() => {
        if (existingImage) {
            setPreview(existingImage);
        }
    }, [existingImage]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="mx-auto p-4 flex flex-col justify-center items-center">
            <div className={styles.imageContainer} onClick={handleClick}>
                {preview && (
                    <Image height={96} width={96} src={preview} priority={true} alt="Preview" className={styles.image}/>
                )}
                <div className={styles.overlay}>
                    <div className={styles.plusIcon}>+</div>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                onChange={handleImageChange}
                className="hidden"
            />
            <label htmlFor="file" className="text-sm text-gray-500">
                {label || 'Choose an image'}
            </label>
        </div>
    );
};

export default ImageUploader;
