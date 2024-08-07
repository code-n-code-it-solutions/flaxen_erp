import Select from 'react-select';
import React, { FC } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useAppSelector } from '@/store';

interface IProps {
    divClasses?: string | '';
    label?: string;
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
    const themeConfig = useAppSelector((state) => state.themeConfig);
    const customStyle = {
        menuPortal: (base: any) => ({ ...base, zIndex: 9999 }), // Adjust zIndex as needed

        control: (provided:any, state:any) => ({
            ...provided,
            backgroundColor: `${themeConfig.theme === 'light' ? 'white' : '#2d3748'}`,
            borderColor: `${themeConfig.theme === 'light' ? '#d2d6dc' : '#4b5563'}`,
            '&:hover': {
                borderColor: `${themeConfig.theme === 'light' ? '#d2d6dc' : '#4b5563'}`,
                backgroundColor: `${themeConfig.theme === 'light' ? 'white' : '#2d3748'}`,
            },
        }),
        // option: (provided:any, state:any) => ({
        //     ...provided,
        //     backgroundColor: `${themeConfig.theme === 'light' ? 'white' : '#2d3748'}`,
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
                                placeholder={'Select ' + label ? label : ''}
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
                        classNames={{
                            // menu hover effect background is also to be change

                            // control: (state) => themeConfig.theme === 'light' ? state.isFocused ? 'dark:bg-slate-100' : 'dark:bg-slate-100' : state.isFocused ? 'dark:bg-slate-800 text-white' : 'dark:bg-slate-800  text-white',
                            // menu: (state) => themeConfig.theme === 'light' ? state + ' dark:bg-slate-100 hover:bg-slate-100' : state + ' dark:bg-slate-800 hover:bg-slate-800 text-white',
                            // option: (state) => themeConfig.theme === 'light' ? state + ' dark:bg-slate-100' : state + ' dark:bg-slate-800',
                            // placeholder: (state) => themeConfig.theme === 'light' ? state + ' text-dark' : state + ' text-white',
                        }}
                        value={getSelectedValue()}
                        styles={{ ...styles, customStyle }}
                        formatOptionLabel={formatOptionLabel}
                        options={options}
                        isSearchable={true}
                        isClearable={true}
                        placeholder={'Select ' + label ? label : ''}
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
