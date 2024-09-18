import React, { FC } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import MaskedInput from 'react-text-mask';

interface IProps {
    divClasses?: string;
    label?: string;
    type: string;
    name: string;
    value?: string;
    placeholder?: string;
    readonly?: boolean;
    required?: boolean;
    disabled?: boolean;
    onChange: (e: any) => void;
    errorMessage?: string;
    isMasked: boolean;
    maskPattern?: any[];
    styles?: any;
    className?: string;
    helperText?: string;
    step?: any;
    labelClassName?: string;
    max?: number;
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
                                      styles,
                                      className,
                                      helperText,
                                      step,
                                      labelClassName,
                                      max
                                  }) => {
    return (
        <div className={divClasses}>
            {label && (
                <label htmlFor={name} className={`form-label flex ${labelClassName}`}>
                    {label} {required && <span className="text-sm text-red-500">*</span>}
                </label>
            )}

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
                        value={value ? new Date(value) : ''}
                        placeholder={placeholder}
                        options={{
                            dateFormat: 'Y-m-d',
                            allowInput: true,
                        }}
                        className="form-input"
                        onChange={onChange}
                    />
                    : type === 'time'
                        ? <Flatpickr
                            options={{
                                noCalendar: true,
                                enableTime: true,
                                dateFormat: 'h:i K',
                                allowInput: true,
                            }}
                            placeholder={placeholder}
                            defaultValue={value}
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
                            className={`form-input ${className} ${errorMessage ? 'border-red-500' : ''} ${disabled ? 'bg-gray-200' : ''}`}
                            disabled={disabled}
                            required={required}
                            readOnly={readonly}
                            style={styles}
                            step={step}
                            max={max}
                        />
            }

            {helperText && <p className="text-sm text-info">{helperText}</p>}
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
    );
};
