import React, { FC } from 'react';
import { ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';
import Link from 'next/link';
import { transformButtonType } from '@/utils/helper';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface IProps {
    text?: string; // Make text optional for icon-only buttons
    icon?: React.ComponentType<any>; // Define the icon prop
    type?: ButtonType;
    variant: ButtonVariant;
    size?: ButtonSize;
    onClick?: () => void;
    link?: string;
    classes?: string;
    disabled?: boolean;
    tooltip?: string;
}

const Button: FC<IProps> = ({
    text,
    icon: Icon,
    type = ButtonType.button,
    variant,
    size,
    onClick,
    link,
    classes = '',
    disabled,
    tooltip
}) => {
    const buttonContent = Icon ? <Icon className="icon" /> : text;

    if (type === ButtonType.link && link) {
        return (
            tooltip
                ? <Tippy content={tooltip}>
                    <Link href={link} className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${classes}`}>
                        {buttonContent}
                    </Link>
                </Tippy>
                : <Link href={link} className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${classes}`}>
                    {buttonContent}
                </Link>
        );
    } else {
        return (
            tooltip
                ? <Tippy content={tooltip}>
                    <button
                        type={transformButtonType(type)}
                        onClick={onClick}
                        disabled={disabled}
                        className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${classes}`}
                    >
                        {buttonContent}
                    </button>
                </Tippy>
                : <button
                    type={transformButtonType(type)}
                    onClick={onClick}
                    disabled={disabled}
                    className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${classes}`}
                >
                    {buttonContent}
                </button>
        );
    }
};

export default Button;
