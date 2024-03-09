import React, {FC} from 'react';
import dynamic from "next/dynamic";

const ReactQuill = dynamic(import('react-quill'), {ssr: false});

interface IProps {
    divClasses?: string;
    label: string;
    name: string;
    value: string;
    rows?: number | 10;
    cols?: number | 30;
    placeholder?: string;
    otherOptions?: Record<string, any>;
    onChange: (e: any) => void;
    errorMessage?: string;
    isReactQuill: boolean;
}

const Textarea: FC<IProps> = ({
                                  divClasses,
                                  name,
                                  label,
                                  value,
                                  cols,
                                  rows,
                                  onChange,
                                  placeholder,
                                  otherOptions,
                                  errorMessage,
                                  isReactQuill
                              }) => {
    return (
        <div className={divClasses}>
            <label htmlFor={name} className="form-label flex">
                {label} {otherOptions?.required && <span className="text-sm text-red-500">*</span>}
            </label>
            {isReactQuill
                ? <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...otherOptions}
                />
                : <textarea
                    className={`form-textarea ${errorMessage ? 'border-red-500' : ''}`}
                    name={name}
                    id={name}
                    placeholder={placeholder}
                    cols={cols}
                    rows={rows}
                    defaultValue={value}
                    {...otherOptions}
                    onChange={onChange}
                ></textarea>}

            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
    );
};

export default Textarea;
