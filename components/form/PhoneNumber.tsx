import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
// import 'react-phone-input-2/lib/style.css';

interface IProps {
    divClasses?: string;
    label?: string;
    name: string;
    value?: string;
    readonly?: boolean;
    required?: boolean;
    disabled?: boolean;
    onChange: (e: any) => void;
    errorMessage?: string;
    styles?: any;
    className?: string;
    helperText?: string;
    labelClassName?: string;
    defaultCountry?: string;
    autoFormat?: boolean;
    enableSearch?: boolean;
}

const PhoneNumber = ({
                         divClasses = '', // Provide a default value
                         label,
                         name,
                         value,
                         onChange,
                         errorMessage, // Use the errorMessage prop
                         readonly = false,
                         required = false,
                         disabled = false,
                         styles,
                         className,
                         helperText,
                         labelClassName,
                         defaultCountry = 'ae',
                         enableSearch = true,
                         autoFormat = true
                     }: IProps) => {
    return (
        <div className={divClasses}>
            {label && (
                <label htmlFor={name} className={`form-label flex ${labelClassName}`}>
                    {label} {required && <span className="text-sm text-red-500">*</span>}
                </label>
            )}
            <PhoneInput
                country={defaultCountry}
                value={value}
                onChange={phone => onChange(phone)}
                disabled={disabled}
                defaultErrorMessage={errorMessage}
                // specialLabel={label}
                enableSearch={enableSearch}
                autoFormat={autoFormat}
            />
            {helperText && <p className="text-sm text-info">{helperText}</p>}
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
    );
};

export default PhoneNumber;
