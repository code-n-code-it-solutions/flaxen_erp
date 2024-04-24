import React from 'react';
import BlankLayout from "@/components/Layouts/BlankLayout";
import Footer from "@/components/Report/Footer";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {useRouter} from "next/router";
import {getIcon} from "@/utils/helper";
import Header from "@/components/Report/Header";

const PrintLayout = ({children}: { children: React.ReactNode }) => {
    const router = useRouter();
    return (
        <div className="flex justify-center flex-col gap-3 mt-3 items-center print:justify-start">
            <div className="flex justify-between print:hidden w-[210mm]">
                <Button
                    type={ButtonType.button}
                    text={
                        <span className="flex justify-center items-center gap-2">
                            {getIcon(IconType.back)}
                            Back
                        </span>
                    }
                    variant={ButtonVariant.secondary}
                    onClick={() => router.back()}
                    size={ButtonSize.small}
                />

                <Button
                    type={ButtonType.button}
                    text={
                        <span className="flex justify-center items-center gap-2">
                            {getIcon(IconType.print)}
                            Print
                        </span>
                    }
                    variant={ButtonVariant.primary}
                    onClick={() => window.print()}
                    size={ButtonSize.small}
                />

            </div>
            <div
                className="relative bg-white shadow print:shadow-none rounded w-[210mm] max-w-[210mm] page-break-after-always page-break-inside-avoid overflow-hidden">
                <div className="absolute top-0 w-full">
                    <Header/>
                </div>
                <div className="pt-[110px] pb-[30px] px-5">
                    {children}
                </div>
                {/*<div className="absolute bottom-0 w-full">*/}
                {/*    <Footer/>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

PrintLayout.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default PrintLayout;
