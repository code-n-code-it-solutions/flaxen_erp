import React, {useEffect, useState} from "react";
import {serverFilePath} from "@/utils/helper";
import PrintLayout from "@/components/Layouts/PrintLayout";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@/store";
import Image from "next/image";
import {clearRawProductState, showDetails} from "@/store/slices/rawProductSlice";
import {setAuthToken} from "@/configs/api.config";
import ContentLoader from "@/components/ContentLoader";

const Print = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const {rawProductDetail, loading} = useAppSelector((state) => state.rawProduct)
    const {token} = useAppSelector((state) => state.user)
    const [content, setContent] = useState<any>({})

    useEffect(() => {
        dispatch(clearRawProductState());
        setAuthToken(token)
        const productId = router.query.id;
        if (productId) {
            const id = Array.isArray(productId) ? productId[0] : productId;
            dispatch(showDetails(parseInt(id)));
        }
    }, []);

    useEffect(() => {
        if (rawProductDetail) {
            setContent(rawProductDetail)
        }
    }, [rawProductDetail]);

    return (
        !loading
            ? (
                <div className="print-container">
                    <div className="flex justify-center flex-col items-center mt-2.5 mb-2.5">
                        <h1 className="text-lg font-bold">
                            Product Details
                        </h1>
                    </div>
                    <div className="flex justify-between items-start p-2.5">
                        <div className="flex flex-col gap-1.25">
                            <span className="text-sm font-semibold">Order No: {content?.item_code}</span>
                            <span className="text-sm font-semibold">Entered
                                At: {(new Date(content?.created_at)).toDateString()}</span>
                        </div>
                        <Image priority={true} src={serverFilePath(content?.thumbnail)} width={70} height={70} alt=""/>
                    </div>
                    <table className="w-full mt-5 border-collapse border border-black text-sm">
                        <tbody>
                        <tr className="border border-black">
                            <td className="border border-black p-1.25 font-semibold">Title</td>
                            <td className="border border-black p-1.25">{content?.title}</td>
                            <td className="border border-black p-1.25 font-semibold">Main Unit</td>
                            <td className="border border-black p-1.25">{content?.unit?.name}</td>
                        </tr>
                        <tr className="border border-black">
                            <td className="border border-black p-1.25 font-semibold">Sub Unit</td>
                            <td className="border border-black p-1.25">{content?.sub_unit?.name}</td>
                            <td className="border border-black p-1.25 font-semibold">Min Stock Alert</td>
                            <td className="border border-black p-1.25">{content?.min_stock_level + ' (' + content?.unit?.name + ')'}</td>
                        </tr>
                        <tr className="border border-black">
                            <td className="border border-black p-1.25 font-semibold">Opening Stock</td>
                            <td className="border border-black p-1.25">{content?.opening_stock + ' (' + content?.sub_unit?.name + ')'}</td>
                            <td className="border border-black p-1.25 font-semibold">Opening Stock Balance</td>
                            <td className="border border-black p-1.25">{content?.opening_stock_unit_balance}</td>
                        </tr>
                        <tr className="border border-black">
                            <td className="border border-black p-1.25 font-semibold">Opening Stock Total Balance
                            </td>
                            <td className="border border-black p-1.25">{content?.opening_stock_total_balance}</td>
                            <td className="border border-black p-1.25 font-semibold">Opening Stock Balance</td>
                            <td className="border border-black p-1.25">{content?.opening_stock_unit_balance}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="grid grid-cols-2 gap-1.25 w-full mt-5">
                        <div className="text-sm flex flex-col justify-start items-start gap-[3px]">
                            <strong>Purchase Description: </strong>
                            <span>{content?.purchase_description}</span>
                        </div>
                        <div className="text-sm flex flex-col justify-start items-start gap-[3px]">
                            <strong>Sale Description: </strong>
                            <span>{content?.sale_description}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-5">
                    <ContentLoader/>
                </div>
            )
    );
}

Print.getLayout = (page: any) => (<PrintLayout>{page}</PrintLayout>)

export default Print;
