import React, {FC} from 'react';

interface IProps {
    divClasses?: string;
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
<<<<<<< HEAD
    defaultChecked?: boolean

=======
    defaultChecked?: boolean;
>>>>>>> 25e6e141cdb32493bcd0ae227bb0c6e5a572350d
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
                    defaultChecked={defaultChecked}
                />
                <span className="text-white-dark">{label}</span>
            </label>
        </div>
    );
};

export default Option;
