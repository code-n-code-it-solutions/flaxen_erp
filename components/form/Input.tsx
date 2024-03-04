import React, {FC} from 'react';
import {MaskConfig} from "@/configs/mask.config";
import MaskedInput from "react-text-mask";

interface IProps {
    divClasses?: string;
    label: string;
    type: string;
    name: string;
    value: string;
    placeholder?: string;
    otherOptions?: Record<string, any>;
    readonly?: boolean;
    required?: boolean;
    disabled?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
    isMasked: boolean;
    maskPattern?: any[];
    styles?: any;
}

export const Input: FC<IProps> = ({
                                      divClasses = '', // Provide a default value
                                      label,
                                      type = 'text',
                                      name,
                                      value,
                                      placeholder,
                                      otherOptions = {}, // Provide a default value
                                      onChange,
                                      errorMessage, // Use the errorMessage prop
                                      isMasked,
                                      maskPattern,
                                      readonly = false,
                                      required = false,
                                      disabled = false,
                                      styles
                                  }) => {
    // console.log(otherOptions)
    return (
        <div className={divClasses}>
            <label htmlFor={name} className="form-label flex">
                {label} {required && <span className="text-sm text-red-500">*</span>}
            </label>

            {isMasked
                ? <MaskedInput
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    className="form-input"
                    guide={true}
                    name={name}
                    value={value}
                    onChange={onChange}
                    mask={maskPattern ? maskPattern : []}
                    disabled={disabled}
                    required={required}
                    readOnly={readonly}
                    style={styles}
                />
                : <input
                    type={type}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`form-input ${errorMessage ? 'border-red-500' : ''}`}
                    disabled={disabled}
                    required={required}
                    readOnly={readonly}
                    style={styles}
                />
            }

            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
    );
};
