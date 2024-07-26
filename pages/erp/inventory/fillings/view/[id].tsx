import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {setPageTitle} from "@/store/slices/themeConfigSlice";
import {clearFillingState, showDetails} from "@/store/slices/fillingSlice";
import PageWrapper from "@/components/PageWrapper";
import {ButtonType, ButtonVariant, IconType} from "@/utils/enums";

const View = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {loading, fillingDetail} = useAppSelector((state) => state.filling);
    const breadCrumbItems = [
        {
            title: 'Home',
            href: '/erp/main',
        },
        {
            title: 'Inventory Dashboard',
            href: '/erp/inventory',
        },
        {
            title: 'All Fillings',
            href: '/erp/inventory/fillings',
        },
        {
            title: 'Fillings Details',
            href: '#',
        },
    ];

    useEffect(() => {
        dispatch(setPageTitle('Fillings Details'));
        dispatch(clearFillingState());

        const fillingId = router.query.id;

        if (fillingId) {
            const id = Array.isArray(fillingId) ? fillingId[0] : fillingId;
            dispatch(showDetails(parseInt(id)));
        }

    }, [router.query.id, dispatch]);

    return (

        <PageWrapper
            loading={loading}
            breadCrumbItems={breadCrumbItems}
            embedLoader={true}
            title="Filling Details"
            buttons={[
                // {
                //     text: 'Edit',
                //     type: ButtonType.link,
                //     variant: ButtonVariant.info,
                //     icon: IconType.edit,
                //     link: '/erp/inventory/fillings/edit/' + router.query.id
                // },
                {
                    text: 'Print',
                    type: ButtonType.link,
                    variant: ButtonVariant.success,
                    icon: IconType.print,
                    link: '/erp/inventory/fillings/print/' + router.query.id
                },
                {
                    text: 'Back',
                    type: ButtonType.link,
                    variant: ButtonVariant.primary,
                    icon: IconType.back,
                    link: '/erp/inventory/fillings'
                }
            ]}
        >


            {fillingDetail && (
                <div>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                        <div className="flex flex-col justify-start items-start gap-1">
                            <span>
                                <strong>Filling Code: </strong>
                                {fillingDetail?.filling_code}
                            </span>
                            <span>
                                <strong>Filling Date: </strong>
                                {fillingDetail?.filling_date}
                            </span>
                            <span>
                                <strong>Filling Time: </strong>
                                {fillingDetail?.filling_time}
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-1">
                            <span>
                                <strong>Batch Number: </strong>
                                {fillingDetail?.production?.batch_number}
                            </span>
                            <span>
                                <strong>Filling Shift: </strong>
                                {fillingDetail?.filling_shift_id}
                            </span>
                            <span>
                                <strong>No of Quantity (KG): </strong>
                                {fillingDetail?.production.no_of_quantity}
                            </span>
                            <span>
                                <strong>Created At: </strong>
                                {(new Date(fillingDetail?.created_at)).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="table-responsive">
                            <h5 className="text-lg font-semibold dark:text-white-light mb-3">Final Calculation</h5>
                            <table>
                                <thead>
                                <tr>
                                    <th>Filling</th>
                                    <th>No of Fillings</th>
                                    <th>Per Filling Cost</th>
                                    <th>Total Cost</th>
                                </tr>
                                </thead>
                                <tbody>

                                {fillingDetail?.filling_calculations.length > 0
                                    ? (fillingDetail?.filling_calculations.map((item: any, index: number) => {

                                            const totalMaterialCost = fillingDetail?.filling_items.reduce((acc: number, item: any) => acc + ((parseFloat(item.unit_cost) * parseFloat(item.quantity) * parseFloat(fillingDetail?.production?.no_of_quantity)) / parseFloat(item.quantity)), 0);
                                            const perFillingCost = (totalMaterialCost / fillingDetail?.production.no_of_quantity * item.capacity) + item.unit_price;
                                            const totalFillingCost = perFillingCost * item.required_quantity;
                                            // console.log('totalMaterialCost', totalMaterialCost)
                                            // console.log('perFillingCost', perFillingCost)
                                            // console.log('totalFillingCost', totalFillingCost)
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="flex justify-start flex-col items-start">
                                                            <span
                                                                style={{fontSize: 8}}>Code: {item.product?.item_code}</span>
                                                            <span>{item.product?.title}</span>
                                                            <span
                                                                style={{fontSize: 8}}>VM: {item.product?.valuation_method}</span>
                                                        </div>
                                                    </td>
                                                    <td>{item.filling_quantity + '(Kg) / ' + item.required_quantity}</td>
                                                    <td>{perFillingCost.toFixed(2)}</td>
                                                    <td>{totalFillingCost.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className='text-center'>No data found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <h5 className="text-lg font-semibold dark:text-white-light pt-10">Item Details</h5>
                    <div className="table-responsive">
                        <table>
                            <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>Product</th>
                                <th>Unit</th>
                                <th>Formula Qty</th>
                                <th>Unit Price</th>
                                <th>Available Qty</th>
                                <th>Req Qty</th>
                                <th>Cost</th>
                            </tr>
                            </thead>
                            <tbody>

                            {fillingDetail?.filling_items.map((item: any, index: any) => (

                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="flex justify-start flex-col items-start">
                                            <span style={{fontSize: 8}}>Code: {item.product?.item_code}</span>
                                            <span>{item.product?.title}</span>
                                            <span
                                                style={{fontSize: 8}}>VM: {item.product?.valuation_method}</span>
                                        </div>
                                    </td>
                                    <td>{item.unit?.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{(item.unit_cost * item.quantity).toFixed(2)}</td>
                                    <td>{item.available_quantity}</td>
                                    <td>{item.required_quantity}</td>
                                    <td>{((parseFloat(item.unit_cost) * parseFloat(item.quantity) * parseFloat(fillingDetail?.production?.no_of_quantity)) / parseFloat(item.quantity)).toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan={3} className="text-center">Total</td>
                                <td>
                                    {fillingDetail?.filling_items?.reduce((total: number, item: any) => total + parseFloat(item.quantity), 0).toFixed(2)}
                                </td>
                                <td>
                                    {fillingDetail?.filling_items?.reduce((total: number, item: any) => total + (parseFloat(item.unit_cost) * parseFloat(item.quantity)), 0).toFixed(2)}
                                </td>
                                <td>
                                    {fillingDetail?.filling_items?.reduce((total: number, item: any) => total + parseFloat(item.available_quantity), 0).toFixed(2)}
                                </td>
                                <td>
                                    {fillingDetail?.filling_items?.reduce((total: number, item: any) => total + parseFloat(item.required_quantity), 0).toFixed(2)}
                                </td>
                                <td>
                                    {fillingDetail?.filling_items?.reduce((total: number, item: any) => total + ((parseFloat(item.unit_cost) * parseFloat(item.quantity) * parseFloat(fillingDetail?.production?.no_of_quantity)) / parseFloat(item.quantity)), 0)
                                        .toFixed(2)}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    {/* Filling Calculation */}
                    <h5 className="text-lg font-semibold dark:text-white-light pt-10">Filling Calculation</h5>
                    <div className="table-responsive">
                        <table>
                            <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>Product Name</th>
                                <th>Unit</th>
                                <th>Unit Cost</th>
                                <th>Qty</th>
                                <th>Capacity</th>
                                <th>Required</th>
                                <th>Total Cost</th>
                            </tr>
                            </thead>
                            <tbody>

                            {fillingDetail?.filling_calculations.map((item: any, index: any) => (

                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="flex justify-start flex-col items-start">
                                            <span style={{fontSize: 8}}>Code: {item.product?.item_code}</span>
                                            <span>{item.product?.title}</span>
                                            <span
                                                style={{fontSize: 8}}>VM: {item.product?.valuation_method}</span>
                                        </div>
                                    </td>
                                    <td>{item.unit?.name}</td>
                                    <td>{item.unit_price}</td>
                                    <td>{item.filling_quantity}</td>
                                    <td>{item.capacity}</td>
                                    <td>{item.required_quantity.toFixed(2)}</td>
                                    <td>{(parseFloat(item.unit_price) * parseFloat(item.required_quantity)).toFixed(2)}</td>

                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan={3} className="text-center">Total</td>
                                <td>
                                    {fillingDetail?.filling_calculations?.reduce((totalCost: number, item: any) => totalCost + parseFloat(item.unit_price), 0)}
                                </td>
                                <td>
                                    {fillingDetail?.filling_calculations?.reduce((totalQuantity: number, item: any) => totalQuantity + parseFloat(item.filling_quantity), 0)}
                                </td>
                                <td>
                                    {fillingDetail?.filling_calculations?.reduce((total_capacity: number, item: any) => total_capacity + parseFloat(item.capacity), 0)}
                                </td>
                                <td>
                                    {fillingDetail?.filling_calculations?.reduce((total_require_quntity: number, item: any) => total_require_quntity + parseFloat(item.required_quantity), 0).toFixed(2)}
                                </td>
                                <td>
                                    {fillingDetail?.filling_calculations
                                        ?.reduce((total: number, item: any) => total + parseFloat(item.unit_price) * parseFloat(item.required_quantity), 0)
                                        .toFixed(2)}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}

        </PageWrapper>
    );
};

export default View;
