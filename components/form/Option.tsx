import React, {FC} from 'react';

interface IProps {
    divClasses?: string;
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Option: FC<IProps> = ({
                                divClasses,
                                label,
                                type,
                                name,
                                value,
                                onChange
                            }) => {
    return (
        <div className={divClasses}>
            <label className="flex items-center cursor-pointer">
                <input
                    type={type}
                    name={name}
                    value={value}
                    className={`${type==='radio' ? 'form-radio' : 'form-checkbox'}`}
                    onChange={onChange}
                    defaultChecked={false}
                />
                <span className="text-white-dark">{label}</span>
            </label>
        </div>
    );
};

export default Option;
