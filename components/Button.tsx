import React, {FC} from 'react';
import {ButtonSize, ButtonType, ButtonVariant} from "@/utils/enums";
import Link from "next/link";
import {transformButtonType} from "@/utils/helper";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';

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
    tooltip?: string;
}

const Button: FC<IProps> = ({
                                text,
                                type = ButtonType.button, // Default type is 'button'
                                variant,
                                size,
                                onClick,
                                link,
                                classes = '',
                                disabled,
                                tooltip
                            }) => {
    if (type === ButtonType.link && link) {
        return (
            tooltip
                ? <Tippy content={tooltip}>
                    <Link href={link} className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${classes}`}>
                        {text}
                    </Link>
                </Tippy>
                : <Link href={link} className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${classes}`}>
                    {text}
                </Link>

        );
    } else { // Otherwise, render a `button` element
        return (
            tooltip
                ? <Tippy content={tooltip}>
                    <button
                        type={transformButtonType(type)}
                        onClick={onClick}
                        disabled={disabled}
                        className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${classes}`}
                    >
                        {text}
                    </button>
                </Tippy>
                : <button
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
