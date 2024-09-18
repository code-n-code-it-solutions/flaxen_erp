import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import { setAuthToken } from '@/configs/api.config';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { AppBasePath } from '@/utils/enums';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import PageWrapper from '@/components/PageWrapper';
import { capitalize } from 'lodash';
import { clearCreditNoteState, getCreditNoteDetail } from '@/store/slices/creditNoteSlice';

const View = () => {
    useSetActiveMenu(AppBasePath.Credit_Notes);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useAppSelector(state => state.user);
    const { creditNoteDetails, loading } = useAppSelector(state => state.creditNote);
    const [ids, setIds] = useState<string[]>([]);

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Credit Note Details'));
        dispatch(clearCreditNoteState());

        const creditNoteIds = router.query.id;

        if (creditNoteIds) {
            setIds(Array.isArray(creditNoteIds) ? creditNoteIds : [creditNoteIds]);
            const id = Array.isArray(creditNoteIds) ? creditNoteIds[0] : creditNoteIds;
            dispatch(getCreditNoteDetail(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Credit_Notes}
                title="Credit Note Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: false
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/sales/credit-notes/print/' + ids.join('/'))
                    },
                    delete: {
                        show: false
                    },
                    duplicate: {
                        show: true,
                        onClick: () => console.log('duplicate')
                    },
                    email: {
                        show: true,
                        onClick: () => console.log('email')
                    }
                }}
                backButton={{
                    show: true,
                    backLink: '/apps/sales/credit-notes'
                }}
            />
            <PageWrapper
                loading={loading}
                embedLoader={true}
            >
                {creditNoteDetails && (
                    <div>
                        <div className="flex justify-between items-center flex-col md:flex-row w-full gap-3">
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Credit Note Code: </strong>
                                    {creditNoteDetails?.credit_note_code}
                                </span>
                                <span>
                                    <strong>Credit Note Date: </strong>
                                    {creditNoteDetails?.credit_note_date}
                                </span>
                                <span>
                                    <strong>Invoice Date: </strong>
                                    {creditNoteDetails?.credit_note_date}
                                </span>
                                <span>
                                    <strong>Return Type: </strong>
                                    {creditNoteDetails?.return_type}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Customer: </strong>
                                    {creditNoteDetails?.customer?.name}
                                </span>
                                <span>
                                    <strong>Return By: </strong>
                                    {creditNoteDetails?.returned_by?.name}
                                </span>
                                <span>
                                    <strong>Created At: </strong>
                                    {new Date(creditNoteDetails?.created_at).toLocaleDateString()}
                                </span>
                                <span>
                                    <strong>Created By: </strong>
                                    {creditNoteDetails?.created_by?.name}
                                </span>
                            </div>
                        </div>
                        <p className="my-3">{creditNoteDetails?.description}</p>
                        <h5 className="text-lg font-semibold dark:text-white-light pt-5">Item Details</h5>
                        <div className="table-responsive mt-3">
                            <table>
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Filling</th>
                                    <th>Capacity</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Before Tax</th>
                                    <th>Tax</th>
                                    <th>Discount</th>
                                    <th className="text-center">Grand Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {creditNoteDetails.credit_note_items.length > 0
                                    ? (creditNoteDetails.credit_note_items.map((item: any, index: number) => (
                                            <tr key={index}>
                                                <td>{item.product_assembly?.formula_name}</td>
                                                <td>{item.product.title}</td>
                                                <td>{item.capacity}</td>
                                                <td>{item.returned_quantity}</td>
                                                <td>{item.retail_price}</td>
                                                <td>
                                                    {(parseFloat(item.returned_quantity) * parseFloat(item.retail_price)).toFixed(2)}
                                                </td>
                                                <td>
                                                    {item.tax_category
                                                        ? (
                                                            <div className="flex flex-col">
                                                                <span><strong>Tax: </strong>{item.tax_category.name} ({item.tax_rate}%)</span>
                                                                <span><strong>Amount: </strong>{item.tax_amount.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span>N/A</span>
                                                        )}
                                                </td>
                                                <td>
                                                    {item.discount_type
                                                        ? (
                                                            <div className="flex flex-col">
                                                                <span><strong>Type: </strong>{capitalize(item.discount_type)}
                                                                </span>
                                                                <span><strong>Rate: </strong>
                                                                    {item.discount_amount_rate.toFixed(2)}{item.discount_type === 'percentage' ? '%' : ''}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span>N/A</span>
                                                        )}
                                                </td>
                                                <td className="text-center">
                                                    {item.total_cost.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="text-center">No items found</td>
                                        </tr>
                                    )}
                                </tbody>
                                {/*    <tfoot>*/}
                                {/*    <tr>*/}
                                {/*        <td colSpan={8} className="text-center font-bold">Total</td>*/}
                                {/*        <td className="text-center font-bold">{deliveryNoteItems.reduce((acc, item) => acc + item.total_cost, 0).toFixed(2)}</td>*/}
                                {/*    </tr>*/}
                                {/*    </tfoot>*/}
                            </table>
                        </div>
                    </div>
                )}
            </PageWrapper>

        </div>
    );
};

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
