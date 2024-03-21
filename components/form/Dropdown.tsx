import Select from "react-select";
import React, {FC} from "react";

interface IProps {
    divClasses?: string | '';
    label: string;
    name: string;
    options: any[];
    value: {};
    styles?: any;
    required?: boolean;
    otherOptions?: Record<string, any>;
    onChange: (e: any,required: any) => void;
    errorMessage?: string;
    isDisabled?: boolean;
}

export const Dropdown: FC<IProps> = ({
                                         divClasses,
                                         label,
                                         name,
                                         value,
                                         styles,
                                         options,
                                         required = false,
                                         otherOptions,
                                         onChange,
                                         errorMessage,
                                         isDisabled
                                     }) => {
    const customStyles = {
        menuPortal: (base: any) => ({...base, zIndex: 9999}), // Adjust zIndex as needed
    };
    return (
        <div className={divClasses}>
            <label htmlFor={name} className="form-label">
                {label} {required && <span className="text-sm text-red-500">*</span>}
            </label>
            <Select
                defaultValue={options[0]}
                value={options.map((option) => {
                    return option.value === value ? option : null
                })}
                styles={{...styles, customStyles}}
                options={options}
                isSearchable={true}
                isClearable={true}
                placeholder={'Select ' + label}
                onChange={onChange}
                isDisabled={isDisabled}
                // menuPortalTarget={document.body}
                {...otherOptions}
            />
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
    );
};
