import React, {FC} from 'react';
import {getIcon, toSentenceCase} from "@/utils/helper";
import {ButtonVariant, IconType} from "@/utils/enums";
import IconButton from "@/components/IconButton";

interface IProps {
    alertType?: 'success' | 'error' | 'warning' | 'info';
    message: string;
    setMessages: (value: string) => void;
}

const Alert = ({
                   alertType = 'success',
                   message,
                   setMessages
               }: IProps) => {
    const alertTypeClass = {
        success: 'bg-success-light text-success dark:bg-success-dark-light',
        error: 'bg-danger-light text-danger dark:bg-danger-dark-light',
        warning: 'bg-warning-light text-warning dark:bg-warning-dark-light',
        info: 'bg-info-light text-info dark:bg-info-dark-light',
    }

    const getCancelIconColor = () => {
        switch (alertType) {
            case 'success':
                return ButtonVariant.success;
            case 'error':
                return ButtonVariant.danger;
            case 'warning':
                return ButtonVariant.warning;
            case 'info':
                return ButtonVariant.info;
            default:
                return ButtonVariant.success;
        }
    }

    return (
        message ? (
            <div className={`flex items-center justify-between rounded p-3.5 ${alertTypeClass[alertType]}`}>
                <span className="ltr:pr-2 rtl:pl-2">
                    <strong className="ltr:mr-1 rtl:ml-1">{toSentenceCase(alertType)}!</strong>
                    {message}
                </span>
                <IconButton
                    icon={IconType.cancel}
                    color={getCancelIconColor()}
                    onClick={() => setMessages('')}
                />
            </div>
        ) : <></>
    );
};

export default Alert;
