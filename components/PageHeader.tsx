import React from 'react';
import Button from "@/components/Button";
import {getIcon} from "@/utils/helper";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";

interface IProps {
    title?: string;
    buttons?: {
        text: string;
        icon?: IconType;
        type: ButtonType;
        variant: ButtonVariant;
        link?: string;
        onClick?: () => void;
        tooltip?: string;
    }[];
}

const PageHeader = ({title, buttons}: IProps) => {
    return (
        <div className="mb-5 flex flex-col-reverse md:flex-row items-start gap-5 md:items-center justify-between">
            <h5 className="text-lg font-semibold dark:text-white-light">
                {title}
            </h5>
            <div className="flex justify-end items-center flex-wrap gap-3">
                {buttons?.map((button, index) => (
                    <Button
                        key={index}
                        text={
                            <span className="flex gap-1 justify-center items-center">
                                {button.icon && getIcon(button.icon)}
                                {button.text}
                            </span>
                        }
                        type={button.type}
                        variant={button.variant}
                        size={ButtonSize.small}
                        link={button.link}
                        onClick={button.onClick}
                        tooltip={button.tooltip}
                    />
                ))}
            </div>
        </div>
    );
};

export default PageHeader;
