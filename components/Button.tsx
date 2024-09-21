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
    variant?: ButtonVariant; // Optional with default value
    size?: ButtonSize; // Optional with default value
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
    variant = ButtonVariant.primary, // Use a valid default, like 'primary'
    size = ButtonSize.medium, // Default size
    onClick,
    link,
    classes = '',
    disabled,
    tooltip
}) => {
    const buttonContent = Icon ? (
        <>
            <Icon className="icon" />
            {text && <span>{text}</span>}
        </>
    ) : text;

    if (type === ButtonType.link && link) {
        return (
            tooltip ? (
                <Tippy content={tooltip}>
                    <Link href={link} className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${classes}`}>
                        {buttonContent}
                    </Link>
                </Tippy>
            ) : (
                <Link href={link} className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${classes}`}>
                    {buttonContent}
                </Link>
            )
        );
    } else {
        return (
            tooltip ? (
                <Tippy content={tooltip}>
                    <button
                        type={transformButtonType(type)}
                        onClick={onClick}
                        disabled={disabled}
                        className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${classes}`}
                        aria-label={text || 'button'} // Provide an aria-label for accessibility
                    >
                        {buttonContent}
                    </button>
                </Tippy>
            ) : (
                <button
                    type={transformButtonType(type)}
                    onClick={onClick}
                    disabled={disabled}
                    className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${classes}`}
                    aria-label={text || 'button'}
                >
                    {buttonContent}
                </button>
            )
        );
    }
};

export default Button;
