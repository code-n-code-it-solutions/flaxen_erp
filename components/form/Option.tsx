import React, {FC} from 'react';

interface IProps {
    divClasses?: string;
    label: string;
    type: string;
    name: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    defaultChecked?: boolean;

}

const Option: FC<IProps> = ({
                                divClasses,
                                label,
                                type,
                                name,
                                value,
                                onChange,
                                defaultChecked = false
                            }) => {
    return (
        <div className={divClasses}>
            <label className="flex items-center cursor-pointer">
                <input
                    type={type}
                    name={name}
                    value={value}
                    className={`${type === 'radio' ? 'form-radio' : 'form-checkbox'}`}
                    onChange={onChange}
                    checked={defaultChecked}
                />
                <span className="text-white-dark">{label}</span>
            </label>
        </div>
    );
};

export default Option;
