import Select from 'react-select';
import React, { FC } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

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
    hint?: string;
    customStyles?: any;
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
                                         formatOptionLabel,
                                         hint,
                                         customStyles
                                     }) => {
    const customStyle = {
        menuPortal: (base: any) => ({ ...base, zIndex: 1 }), // Adjust zIndex as needed
        // option: (provided:any, state:any) => ({
        //     ...provided,
        //     paddingLeft: `${(state.data.depth || 0) * 20}px`
        // }),
        // group: (provided:any) => ({
        //     ...provided,
        //     paddingLeft: '10px'
        // }),
    };
    // console.log(customStyle);

    const getSelectedValue = () => {
        if (isMulti) {
            return value ? value.split(',').map((id: any) => options?.find(option => option.value === parseInt(id))) : [];
        } else {
            return options?.find(option => option.value === value) || null;
        }
    };

    return (
        <div className={divClasses}>
            <label htmlFor={name} className="form-label">
                {label} {required && <span className="text-sm text-red-500">*</span>}
            </label>
            {hint
                ? (
                    <Tippy content={hint}>
                        <div>
                            <Select
                                // defaultValue={options[0]}
                                value={getSelectedValue()}
                                styles={{ ...styles, customStyle }}
                                formatOptionLabel={formatOptionLabel}
                                options={options}
                                isSearchable={true}
                                isClearable={true}
                                placeholder={'Select ' + label}
                                onChange={onChange}
                                isDisabled={isDisabled}
                                isLoading={isLoading}
                                menuPortalTarget={document.parentElement}
                                {...otherOptions}
                                isMulti={isMulti}
                            />
                        </div>
                    </Tippy>
                ) : (
                    <Select
                        // defaultValue={options[0]}
                        value={getSelectedValue()}
                        styles={{ ...styles, customStyle }}
                        formatOptionLabel={formatOptionLabel}
                        options={options}
                        isSearchable={true}
                        isClearable={true}
                        placeholder={'Select ' + label}
                        onChange={onChange}
                        isDisabled={isDisabled}
                        isLoading={isLoading}
                        menuPortalTarget={document.parentElement}
                        {...otherOptions}
                        isMulti={isMulti}
                    />
                )}


            {/*{hint && <p className="text-[12px] text-info">{hint}</p>}*/}
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
    );
};
