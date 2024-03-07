import React, {FC} from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import MaskedInput from "react-text-mask";

interface IProps {
    divClasses?: string;
    label: string;
    type: string;
    name: string;
    value: string;
    placeholder?: string;
    readonly?: boolean;
    required?: boolean;
    disabled?: boolean;
    onChange: (e: any) => void;
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
                                      onChange,
                                      errorMessage, // Use the errorMessage prop
                                      isMasked,
                                      maskPattern,
                                      readonly = false,
                                      required = false,
                                      disabled = false,
                                      styles
                                  }) => {
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
                : type === 'date'
                    ? <Flatpickr
                        value={value}
                        placeholder={placeholder}
                        options={{
                            dateFormat: 'Y-m-d'
                        }}
                        className="form-input"
                        onChange={onChange}
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
