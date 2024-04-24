import React, {useEffect, useState} from 'react';
import PrintLayout from "@/components/Layouts/PrintLayout";
import {serverFilePath} from "@/utils/helper";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@/store";
import {setAuthToken} from "@/configs/api.config";
import {clearEmployeeState, showDetails} from "@/store/slices/employeeSlice";
import Image from "next/image";
import ContentLoader from "@/components/ContentLoader";

const Print = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const {employeeDetail, loading} = useAppSelector((state) => state.employee)
    const {token} = useAppSelector((state) => state.user)

    const [content, setContent] = useState<any>({})

    useEffect(() => {
        dispatch(clearEmployeeState());
        setAuthToken(token)
        const query = router.query.id;
        if (query) {
            const id = Array.isArray(query) ? query[0] : query;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query, dispatch]);

    useEffect(() => {
        if (employeeDetail) {
            setContent(employeeDetail)
        }
    }, [employeeDetail]);

    return (
        loading
            ? <div className="my-5">
                <ContentLoader/>
            </div>
            : <div className="print-container">
                <div className="flex flex-col items-center justify-center my-2.5">
                    <h1 className="text-xl font-bold">
                        Employee Detail
                    </h1>
                </div>
                <div className="flex justify-between items-start p-2.5">
                    <div className="flex flex-col gap-1.25">
                        <span className="text-sm">
                            <strong>Employee Code:</strong> {content?.employee_code}
                        </span>
                        <span className="text-sm">
                            <strong>Registered At:</strong> {(new Date(content?.created_at)).toDateString()}
                        </span>
                    </div>
                    <Image priority={true} src={serverFilePath(content?.thumbnail?.path)} width={70} height={70} alt=""/>
                </div>
                <table className="w-full mt-5 border-collapse border border-black-light text-sm">
                    <tbody>
                    <tr className="border border-black-light">
                        <td className="border border-black-light p-1.25">
                            <strong>Name</strong>
                        </td>
                        <td className="border border-black-light p-1.25">
                            {content?.user?.name}
                        </td>
                        <td className="border border-black-light p-1.25">
                            <strong>Email</strong>
                        </td>
                        <td className="border border-black-light p-1.25">
                            {content?.user?.email}
                        </td>
                    </tr>
                    <tr className="border border-black-light">
                        <td className="border border-black-light p-1.25">
                            <strong>Phone</strong>
                        </td>
                        <td className="border border-black-light p-1.25">
                            {content?.phone}
                        </td>
                        <td className="border border-black-light p-1.25">
                            <strong>Joining Date</strong>
                        </td>
                        <td className="border border-black-light p-1.25">
                            {content?.date_of_joining}
                        </td>
                    </tr>
                    <tr className="border border-black-light">
                        <td className="border border-black-light p-1.25">
                            <strong>Department</strong>
                        </td>
                        <td className="border border-black-light p-1.25">
                            {content?.department?.name}
                        </td>
                        <td className="border border-black-light p-1.25">
                            <strong>Designation</strong>
                        </td>
                        <td className="border border-black-light p-1.25">
                            {content?.designation?.name}
                        </td>
                    </tr>
                    <tr className="border border-black-light">
                        <td className="border border-black-light p-1.25">
                            <strong>Passport Number</strong>
                        </td>
                        <td className="border border-black-light p-1.25">
                            {content?.passport_number}
                        </td>
                        <td className="border border-black-light p-1.25">
                            <strong>ID Number</strong>
                        </td>
                        <td className="border border-black-light-light p-1.25">
                            {content?.id_number}
                        </td>
                    </tr>
                    <tr className="border border-black-light">
                        <td className="border border-black-light p-1.25">
                            <strong>Address</strong>
                        </td>
                        <td colSpan={3} className="border border-black-light p-1.25">
                            {content?.address + ' ' + content?.city?.name + ' ' + content?.state?.name + ', ' + content?.country?.name + ', ' + content?.postal_code}
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div className="flex flex-col items-start justify-start mt-5 w-full">
                    <h1 className="text-lg font-bold">
                        Bank Details
                    </h1>
                    <table>
                        <thead>
                        <tr>
                            <th>Bank Name</th>
                            <th>Account Name</th>
                            <th>Account Number</th>
                            <th>IBAN</th>
                            <th>Currency</th>
                        </tr>
                        </thead>
                        <tbody>
                        {content?.bank_accounts?.length > 0 ? content?.bank_accounts?.map((bank: any, index: number) => (
                            <tr key={index}>
                                <td>{bank.bank.name}</td>
                                <td>{bank.account_name}</td>
                                <td>{bank.account_number}</td>
                                <td>{bank.iban}</td>
                                <td>{bank.currency?.code}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5}>
                                    No Bank Details Found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col items-start justify-start mt-5 w-full">
                    <h1 className="text-lg font-bold">
                        Documents Uploaded
                    </h1>
                    <table>
                        <thead>
                        <tr>
                            <th>Document Name</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {content?.documents?.length > 0 ? content?.documents?.map((document: any, index: number) => (
                            <tr key={index} className="border border-black-light">
                                <td>{document.name}</td>
                                <td>{document.description}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={2}>
                                    No Documents Found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

            </div>
    );
};
Print.getLayout = (page: any) => (<PrintLayout>{page}</PrintLayout>)
export default Print;
