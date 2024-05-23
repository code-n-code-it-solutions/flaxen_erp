import React from 'react';
import { useAppDispatch } from '@/store';

interface IProps {
    onClick?: () => void;
    icon?: React.ReactNode;
    text?: string;
    className?: string;
    isDisabled?: boolean;
    isListButton?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'white' | 'black' | 'transparent' | 'primary-outline' | 'secondary-outline' | 'danger-outline' | 'success-outline' | 'warning-outline' | 'info-outline' | 'light-outline' | 'dark-outline' | 'link-outline' | 'white-outline' | 'black-outline' | 'transparent-outline' | 'primary-sm' | 'secondary-sm' | 'danger-sm' | 'success-sm' | 'warning-sm' | 'info-sm' | 'light-sm' | 'dark-sm' | 'link-sm' | 'white-sm' | 'black-sm' | 'transparent-sm' | 'primary-outline-sm' | 'secondary-outline-sm' | 'danger-outline-sm' | 'success-outline-sm' | 'warning-outline-sm' | 'info-outline-sm' | 'light-outline-sm' | 'dark-outline-sm' | 'link-outline-sm' | 'white-outline-sm' | 'black-outline-sm' | 'transparent-outline-sm' | 'primary-lg' | 'secondary-lg' | 'danger-lg' | 'success-lg' | 'warning-lg' | 'info-lg' | 'light-lg' | 'dark-lg' | 'link-lg' | 'white-lg' | 'black-lg' | 'transparent-lg' | 'primary-outline-lg' | 'secondary-outline-lg' | 'danger-outline-lg' | 'success-outline-lg' | 'warning-outline-lg' | 'info-outline-lg' | 'light-outline-lg' | 'dark-outline-lg' | 'link-outline-lg' | 'white-outline-lg' | 'black-outline-lg' | 'transparent-outline-lg' | 'primary-md' | 'secondary-md' | 'danger-md' | 'success-md' | 'warning-md' | 'info-md' | 'light-md' | 'dark-md' | 'link-md' | 'white-md' | 'black-md' | 'transparent-md' | 'primary-outline-md' | 'secondary-outline-md' | 'danger-outline-md' | 'success-outline-md' | 'warning-outline-md' | 'info-outline-md' | 'light-outline-md' | 'dark-outline-md' | 'link-outline-md' | 'white-outline-md' | 'black-outline-md' | 'transparent-outline-md';
}

const CustomButton = ({
                          onClick,
                          icon,
                          text,
                          className,
                          isDisabled,
                          isListButton,
                          variant = 'primary'
                      }: IProps) => {
    return (
        <div>
            {isListButton ? (
                <span
                    onClick={onClick}
                    className={`flex gap-1 items-center ${className}`}
                >
                    {icon}
                    {text}
                </span>
            ) : (
                <button
                    onClick={onClick}
                    disabled={isDisabled}
                    className={`flex gap-1 items-center btn btn-${variant} btn-sm ${className}`}
                >
                    {icon}
                    {text}
                </button>
            )}
        </div>
    );
};

export default CustomButton;
