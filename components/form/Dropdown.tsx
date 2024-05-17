import Select from "react-select";
import React, {FC} from "react";

interface IProps {
    divClasses?: string | '';
    label: string;
    name: string;
    options?: any[];
    formatOptionLabel?: (option: any) => any;
    isAdvanced?: boolean;
    value: any;
    styles?: any;
    required?: boolean;
    otherOptions?: Record<string, any>;
    onChange: (e: any, required: any) => void;
    errorMessage?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    isMulti?: boolean;
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
                                         isDisabled = false,
                                         isLoading = false,
                                         isMulti = false,
                                         isAdvanced = false,
                                         formatOptionLabel
                                     }) => {
    const customStyles = {
        menuPortal: (base: any) => ({...base, zIndex: 9999}), // Adjust zIndex as needed
    };

    const getSelectedValue = () => {
        if (isMulti) {
            return value ? value : [];
        } else {
            return options?.find(option => option.value === value) || null;
        }
    };

    return (
        <div className={divClasses}>
            <label htmlFor={name} className="form-label">
                {label} {required && <span className="text-sm text-red-500">*</span>}
            </label>
            <Select
                // defaultValue={options[0]}
                value={getSelectedValue()}
                styles={{...styles, customStyles}}
                formatOptionLabel={formatOptionLabel}
                options={options}
                isSearchable={true}
                isClearable={true}
                placeholder={'Select ' + label}
                onChange={onChange}
                isDisabled={isDisabled}
                isLoading={isLoading}
                // menuPortalTarget={document.body}
                {...otherOptions}
                isMulti={isMulti}
            />
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
    );
};
