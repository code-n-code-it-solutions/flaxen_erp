import React from "react";
import IconButton from "@/components/IconButton";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import Button from "@/components/Button";

const FileDownloader = ({file, title, buttonType, buttonVariant, size}: {
    file: File,
    title: string,
    buttonType: ButtonType,
    buttonVariant: ButtonVariant,
    size: ButtonSize
}) => {
    const downloadFile = () => {
        if (file) {
            const blobUrl = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        }
    };

    return (
        buttonType === ButtonType.icon
            ? <IconButton
                icon={IconType.download}
                color={buttonVariant}
                onClick={downloadFile}
            />
            : buttonType === ButtonType.button
                ? <Button
                    type={buttonType}
                    size={size}
                    text={title}
                    variant={buttonVariant}
                    onClick={downloadFile}
                />
                : <a href='javascript:void(0)' className='text-primary' onClick={downloadFile}>{title}</a>


    );
};

export default FileDownloader;
