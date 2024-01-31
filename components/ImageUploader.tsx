import React, {ChangeEvent, useState} from 'react';

interface ImageUploaderProps {
    image: File | null;
    setImage: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, setImage }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file && file.type.startsWith('image/')) {
            setImage(file);
        } else {
            setImage(null);
        }

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    return (
        <div className="mx-auto p-4 flex flex-col justify-center items-center">
            {preview && (
                <img src={preview} alt="Preview" className="mt-4 w-24 h-24 object-cover border rounded shadow my-3"/>
            )}

            <input
                type="file"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
            />
        </div>
    );
};

export default ImageUploader;
