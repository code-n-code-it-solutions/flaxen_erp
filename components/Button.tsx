import React, {FC} from 'react';
import {ButtonSize, ButtonType, ButtonVariant} from "@/utils/enums";
import Link from "next/link";
import {transformButtonType} from "@/utils/helper";

// Enums remain unchanged


interface IProps {
    text: any;
    type?: ButtonType; // Made optional and will set a default value
    variant: ButtonVariant;
    size?: ButtonSize;
    onClick?: () => void;
    link?: any;
    classes?: string | '';
    disabled?: boolean;
}

const Button: FC<IProps> = ({
                                text,
                                type = ButtonType.button, // Default type is 'button'
                                variant,
                                size,
                                onClick,
                                link,
                                classes = '',
                                disabled
                            }) => {
    if (type === ButtonType.link && link) {
        return (
            <Link href={link} className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${classes}`}>
                {text}
            </Link>
        );
    } else { // Otherwise, render a `button` element
        return (
            <button
                type={transformButtonType(type)}
                onClick={onClick}
                disabled={disabled}
                className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${classes}`}
            >
                {text}
            </button>
        );
    }
};

export default Button;
