import React, {FC} from 'react';
import {IconType, ButtonVariant} from "@/utils/enums";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Link from "next/link";
import {getIcon} from "@/utils/helper";

interface IProps {
    icon: IconType;
    color: ButtonVariant;
    onClick?: () => void;
    classes?: string;
    link?: string;
    tooltip?: string;
    disabled?: boolean;
}

const IconButton: FC<IProps> = ({
                                    icon,
                                    color,
                                    onClick,
                                    classes = '',
                                    link,
                                    tooltip,
                                    disabled
                                }) => {
    const WithTooltip = ({children, tooltip}: { children: any; tooltip: string }) => (
        <Tippy content={tooltip}>
            <span>{children}</span>
        </Tippy>
    )

    const LinkButton = ({children, link, color}: { children: React.ReactNode; link: string; color: ButtonVariant }) => (
        <Link href={link} className={`text-${color} ${classes}`} style={disabled ? {pointerEvents: 'none'} : {}} aria-disabled={disabled}>{children}</Link>
    );

    const SpanButton = ({children, onClick, color}: {
        children: React.ReactNode;
        onClick?: () => void;
        color: ButtonVariant
    }) => (
        <span onClick={!disabled ? onClick : ()=>{}} className={`text-${color} ${classes}`} style={{cursor: 'pointer'}} aria-disabled={disabled}>{children}</span>
    );

    return tooltip ? (
        <WithTooltip tooltip={tooltip}>
            {link ? (
                <LinkButton link={link} color={color}>
                    {getIcon(icon)}
                </LinkButton>
            ) : (
                <SpanButton onClick={onClick} color={color}>
                    {getIcon(icon)}
                </SpanButton>
            )}
        </WithTooltip>
    ) : link ? (
        <LinkButton link={link} color={color}>
            {getIcon(icon)}
        </LinkButton>
    ) : (
        <SpanButton onClick={onClick} color={color}>
            {getIcon(icon)}
        </SpanButton>
    );
};

export default IconButton;
