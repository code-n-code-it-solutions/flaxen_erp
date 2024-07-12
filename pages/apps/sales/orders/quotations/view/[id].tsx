import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import PageWrapper from '@/components/PageWrapper';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import { AppBasePath } from '@/utils/enums';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';
import { clearQuotationState, showDetails } from '@/store/slices/quotationSlice';

const View = () => {
    useSetActiveMenu(AppBasePath.Quotation);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, quotationDetail } = useAppSelector((state) => state.quotation);
    const [ids, setIds] = useState<string[]>([]);

    useEffect(() => {
        dispatch(setPageTitle('Quotation Details'));
        dispatch(clearQuotationState());
        const quotationId = router.query.id;
        if (quotationId) {
            setIds(Array.isArray(quotationId) ? quotationId : [quotationId]);
            const id = Array.isArray(quotationId) ? quotationId[0] : quotationId;
            dispatch(showDetails(parseInt(id)));
        }

    }, [router.query.id, dispatch]);

    const calculateTotal = (item: any) => {
        let totalCost = parseFloat(item.retail_price) * parseFloat(item.quantity);
        let taxAmount = (totalCost * parseFloat(item.tax_rate)) / 100;
        let discountAmount = item.discount_type === 'percentage' ? (totalCost * parseFloat(item.discount_amount_rate)) / 100 : parseFloat(item.discount_amount_rate);
        return totalCost + taxAmount - discountAmount;
    };

    return (
        <div>
            <DetailPageHeader
                appBasePath={AppBasePath.Quotation}
                title="Quotation Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: false
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/sales/orders/quotations/print/' + ids.join('/'))
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
                    backLink: '/apps/sales/orders/quotations'
                }}
            />
            <PageWrapper
                loading={loading}
                breadCrumbItems={[]}
                embedLoader={true}
            >
                {quotationDetail && (
                    <div>
                        <div className="flex justify-between items-center flex-col md:flex-row w-full gap-3">
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Quotation Code: </strong>
                                    {quotationDetail?.quotation_code}
                                </span>
                                <span>
                                    <strong>Receipt Delivery (Days): </strong>
                                    {quotationDetail?.receipt_delivery_due_days}
                                </span>
                                <span>
                                    <strong>Delivery: </strong>
                                    {quotationDetail?.delivery_due_in_days + ' - ' + quotationDetail?.delivery_due_date}
                                </span>
                                <span>
                                    <strong>Created At: </strong>
                                    {(new Date(quotationDetail?.created_at)).toLocaleDateString() + '  ' + (new Date(quotationDetail?.created_at)).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <span>
                                    <strong>Salesman: </strong>
                                    {quotationDetail?.salesman?.name}
                                </span>
                                <span>
                                    <strong>Customer: </strong>
                                    {quotationDetail?.customer?.name}
                                </span>
                                <span>
                                    <strong>Contact Person: </strong>
                                    {quotationDetail?.contact_person?.name}
                                </span>
                                <span>
                                    <strong>Created By: </strong>
                                    {quotationDetail?.created_by?.name}
                                </span>
                            </div>
                        </div>

                        <h5 className="text-lg font-semibold dark:text-white-light pt-10">Item Details</h5>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Product</th>
                                    <th>Batch #</th>
                                    <th>Filling</th>
                                    <th>Available</th>
                                    <th>Retail Price</th>
                                    <th>Qty</th>
                                    <th>Tax</th>
                                    <th>Discount</th>
                                    <th>Total Cost</th>
                                </tr>
                                </thead>
                                <tbody>

                                {quotationDetail?.quotation_items.map((item: any, index: any) => (

                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.product_assembly.formula_name}</td>
                                        <td>{item.batch_number}</td>
                                        <td>
                                            <div className="flex justify-start flex-col items-start">
                                                <span style={{ fontSize: 8 }}>{item.product?.item_code}</span>
                                                <span>{item.product?.title}</span>
                                                <span
                                                    style={{ fontSize: 8 }}>{item.product?.valuation_method}</span>
                                            </div>
                                        </td>
                                        <td>{item.available_quantity}</td>
                                        <td>{item.retail_price.toFixed(2)}</td>
                                        <td>{item.quantity.toFixed(2)}</td>
                                        <td>{item.tax_amount.toFixed(2) + ' (' + item.tax_rate + '%)'}</td>
                                        <td>{Number(item.discount_amount_rate).toFixed(2)}{item.discount_type === 'percentage' ? '%' : '/-'}</td>
                                        <td>{calculateTotal(item).toFixed(2)}</td>

                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan={9} className="text-center py-2">Total</td>
                                    <td className="ps-4 py-2">
                                        {quotationDetail?.quotation_items
                                            ?.reduce((total: number, item: any) => total + calculateTotal(item), 0)
                                            .toFixed(2)}
                                    </td>
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

View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
