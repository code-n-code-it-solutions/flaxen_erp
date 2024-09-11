import React, { useEffect, useState } from 'react';
import { setAuthToken } from '@/configs/api.config';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { AppBasePath } from '@/utils/enums';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import PageWrapper from '@/components/PageWrapper';
import { capitalize } from 'lodash';
import { clearDebitNoteState, getDebitNoteDetail } from '@/store/slices/debitNoteSlice';

const View = () => {
    useSetActiveMenu(AppBasePath.Debit_Notes);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useAppSelector(state => state.user);
    const { debitNoteDetails, loading } = useAppSelector(state => state.debitNote);
    const [ids, setIds] = useState<string[]>([]);
    const [deliveryNoteItems, setDeliveryNoteItems] = useState<any[]>([]);

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Debit Note Details'));
        dispatch(clearDebitNoteState());

        const debitNoteId = router.query.id;

        if (debitNoteId) {
            setIds(Array.isArray(debitNoteId) ? debitNoteId : [debitNoteId]);
            const id = Array.isArray(debitNoteId) ? debitNoteId[0] : debitNoteId;
            dispatch(getDebitNoteDetail(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    useEffect(() => {
        if (debitNoteDetails) {
            // setDeliveryNoteItems(debitNoteDetails.delivery_note_sale_invoices.map((item: any) => item.delivery_note.delivery_note_items).flat());
        }
    }, [debitNoteDetails]);

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Invoice}
                title="Invoice Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: false
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/purchase/debit-note/print/' + ids.join('/'))
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
                    backLink: '/apps/purchase/debit-note'
                }}
            />
            <PageWrapper
                loading={loading}
                embedLoader={true}
            >
                {debitNoteDetails && (
                    <div>
                        <div className="flex justify-between items-center flex-col md:flex-row w-full gap-3">
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Debit Note Code: </strong>
                                    {debitNoteDetails?.debit_note_code}
                                </span>
                                <span>
                                    <strong>Vendor: </strong>
                                    {debitNoteDetails?.vendor?.name}
                                </span>

                                <span>
                                    <strong>Returned Date: </strong>
                                    {debitNoteDetails?.debit_note_date}
                                </span>

                                <span>
                                    <strong>Created At: </strong>
                                    {new Date(debitNoteDetails?.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Returned By: </strong>
                                    {debitNoteDetails?.returned_by?.name}
                                </span>
                                <span>
                                    <strong>Return Type: </strong>
                                    {debitNoteDetails?.return_type}
                                </span>
                                <span>
                                    <strong>Created By: </strong>
                                    {debitNoteDetails?.created_by?.name}
                                </span>
                            </div>
                        </div>

                        <h5 className="text-lg font-semibold dark:text-white-light pt-10">Item Details</h5>
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
                                {deliveryNoteItems.length > 0
                                    ? (deliveryNoteItems.map((item: any, index: number) => (
                                            <tr key={index}>
                                                <td>{item.product_assembly.formula_name}</td>
                                                <td>{item.product.title}</td>
                                                <td>{item.capacity}</td>
                                                <td>{item.delivered_quantity}</td>
                                                <td>{item.retail_price}</td>
                                                <td>
                                                    {(parseFloat(item.delivered_quantity) * parseFloat(item.retail_price)).toFixed(2)}
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
                                <tfoot>
                                <tr>
                                    <td colSpan={8} className="text-center font-bold">Total</td>
                                    <td className="text-center font-bold">{deliveryNoteItems.reduce((acc, item) => acc + item.total_cost, 0).toFixed(2)}</td>
                                </tr>
                                </tfoot>
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
