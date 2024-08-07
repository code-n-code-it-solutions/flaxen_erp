import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import { setAuthToken } from '@/configs/api.config';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { AppBasePath } from '@/utils/enums';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { clearSaleInvoiceState, showDetails } from '@/store/slices/saleInvoiceSlice';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import PageWrapper from '@/components/PageWrapper';
import { capitalize } from 'lodash';

const View = () => {
    useSetActiveMenu(AppBasePath.Invoice);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useAppSelector(state => state.user);
    const { saleInvoiceDetail, loading } = useAppSelector(state => state.saleInvoice);
    const [ids, setIds] = useState<string[]>([]);
    const [deliveryNoteItems, setDeliveryNoteItems] = useState<any[]>([]);

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Sale Invoice Details'));
        dispatch(clearSaleInvoiceState());

        const saleInvoiceId = router.query.id;

        if (saleInvoiceId) {
            setIds(Array.isArray(saleInvoiceId) ? saleInvoiceId : [saleInvoiceId]);
            const id = Array.isArray(saleInvoiceId) ? saleInvoiceId[0] : saleInvoiceId;
            dispatch(showDetails(parseInt(id)));
        }
    }, [router.query.id, dispatch]);

    useEffect(() => {
        if (saleInvoiceDetail) {
            setDeliveryNoteItems(saleInvoiceDetail.delivery_note_sale_invoices.map((item: any) => item.delivery_note.delivery_note_items).flat());
        }
    }, [saleInvoiceDetail]);

    return (
        <div className="flex flex-col gap-3">
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
                        onClick: () => router.push('/apps/sales/invoices/print/' + ids.join('/'))
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
                    backLink: '/apps/sales/invoices'
                }}
            />
            <PageWrapper
                loading={loading}
                embedLoader={true}
            >
                {saleInvoiceDetail && (
                    <div>
                        <div className="flex justify-between items-center flex-col md:flex-row w-full gap-3">
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Sale Invoice Code: </strong>
                                    {saleInvoiceDetail?.sale_invoice_code}
                                </span>
                                <span>
                                    <strong>Invoice Reference: </strong>
                                    {saleInvoiceDetail?.invoice_reference}
                                </span>

                                <span>
                                    <strong>Invoice Date: </strong>
                                    {saleInvoiceDetail?.invoice_date}
                                </span>


                                {saleInvoiceDetail?.payment_terms && (
                                    <span>
                                        <strong>Payment Terms: </strong>
                                        {saleInvoiceDetail?.payment_terms} Days
                                    </span>
                                )}
                                {saleInvoiceDetail?.due_date && (
                                    <span>
                                        <strong>Due Date: </strong>
                                        {saleInvoiceDetail?.due_date}
                                    </span>
                                )}
                                <span>
                                    <strong>Created At: </strong>
                                    {new Date(saleInvoiceDetail?.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Salesman: </strong>
                                    {saleInvoiceDetail?.salesman?.name}
                                </span>
                                <span>
                                    <strong>Customer: </strong>
                                    {saleInvoiceDetail?.customer?.name}
                                </span>
                                <span>
                                    <strong>Contact Person: </strong>
                                    {saleInvoiceDetail?.contact_person?.name}
                                </span>
                                <span>
                                    <strong>Created By: </strong>
                                    {saleInvoiceDetail?.created_by?.name}
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
