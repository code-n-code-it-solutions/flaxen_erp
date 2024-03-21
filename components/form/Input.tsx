import React, {FC, ChangeEvent} from 'react';
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
    onChange: (event: React.ChangeEvent<HTMLInputElement>, required: boolean) => void; // Keep the 'required' parameter

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
                onChange={(e) => onChange(e, required)}
                mask={maskPattern ? maskPattern : []}
                disabled={disabled}
                required={required}
                readOnly={readonly}
                style={styles}
                // errorMessage={errorMessage}
            />
                : type === 'date'
                    ? <Flatpickr
                        value={value}
                        placeholder={placeholder}
                        options={{
                            dateFormat: 'Y-m-d'
                        }}
                        className="form-input"
                        // onChange={(dates: Date[]) => onChange(dates[0].toISOString(), required)} // Pass the 'required' parameter
                    />
                    : <input
                        type={type}
                        name={name}
                        id={name}
                        value={value}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e, required)} // Pass the 'required' parameter
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
