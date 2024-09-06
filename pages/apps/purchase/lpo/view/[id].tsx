import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { clearLocalPurchaseOrderState, markLPOItemComplete, showDetails } from '@/store/slices/localPurchaseOrderSlice';
import PageWrapper from '@/components/PageWrapper';
import { AppBasePath, ButtonSize, ButtonType, ButtonVariant } from '@/utils/enums';
import Button from '@/components/Button';
import { setAuthToken } from '@/configs/api.config';
import Option from '@/components/form/Option';
import AppLayout from '@/components/Layouts/AppLayout';
import DetailPageHeader from '@/components/apps/DetailPageHeader';
import useSetActiveMenu from '@/hooks/useSetActiveMenu';

const View = () => {
    useSetActiveMenu(AppBasePath.Local_Purchase_Order);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useAppSelector(state => state.user);
    const { loading, LPODetail } = useAppSelector(state => state.localPurchaseOrder);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [ids, setIds] = useState<string[]>([]);

    const getDetails = () => {
        setAuthToken(token);
        const lpoId = router.query.id;

        if (lpoId) {
            setIds(Array.isArray(lpoId) ? lpoId : [lpoId]);
            const id = Array.isArray(lpoId) ? lpoId[0] : lpoId;
            dispatch(showDetails(parseInt(id)));
        }
    };

    const handleSelectAllClick = (e: any) => {
        if (e.target.checked) {
            const allItemIds = LPODetail.raw_materials.map((item: any) => item.id);
            setSelectedItems(allItemIds);
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItemClick = (id: number, isChecked: boolean) => {
        if (isChecked) {
            setSelectedItems([...selectedItems, id]);
        } else {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        }
    };

    const handleMarkComplete = () => {
        setAuthToken(token);
        if (selectedItems.length === 0) {
            alert('Please select at least one item to mark as complete');
            return;
        } else {
            dispatch(markLPOItemComplete(selectedItems));
            getDetails();
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Local Purchase Order Details'));
        dispatch(clearLocalPurchaseOrderState());
        getDetails();
    }, [router.query.id, dispatch]);

    return (
        <div className="flex flex-col gap-3">
            <DetailPageHeader
                appBasePath={AppBasePath.Local_Purchase_Order}
                title="LPO Details"
                middleComponent={{
                    show: true,
                    edit: {
                        show: false
                    },
                    print: {
                        show: true,
                        onClick: () => router.push('/apps/purchase/lpo/print/' + ids[0])
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
                    backLink: '/apps/purchase/lpo'
                }}
            />
            <PageWrapper
                loading={loading}
                embedLoader={true}
            >
                {LPODetail && (
                    <div>
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-lg font-bold">
                                Purchase Order
                            </h1>
                            <span className="text-sm">{LPODetail?.lpo_number}</span>
                            <span
                                className="text-sm">{(new Date(LPODetail?.created_at)).toLocaleDateString() + ' ' + (new Date(LPODetail?.created_at)).toLocaleTimeString()}</span>
                        </div>

                        <div className="flex justify-between items-center mt-5">
                            <div className="flex flex-col">
                                <span className="uppercase font-bold">TO</span>
                                <span className=" font-bold">{LPODetail?.vendor?.name}</span>
                                <span>{LPODetail?.vendor?.address + ' ' + LPODetail?.vendor?.city?.name + ', ' + LPODetail?.vendor?.state?.name}</span>
                                <span>{LPODetail?.vendor?.country?.name + ' ' + LPODetail?.vendor?.postal_code}</span>
                                <span className="">{LPODetail?.vendor?.phone}</span>
                                <span className=" font-bold">Rep: {LPODetail?.vendor_representative.name}</span>
                                <span className=" font-bold">Rep Ph: {LPODetail?.vendor_representative.phone}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="uppercase font-bold">Address Correspondence To</span>
                                <span className="">Flaxen Paints Industry LLC</span>
                                <span className="">
                                    Plot # 593 Industrial Area <br />
                                    Umm Al Thuoob Umm Al Quwain, UAE
                                </span>
                                <span className="font-bold">Name: Anwar Ali</span>
                                <span className="font-bold">Email: info@flaxenpaints.com</span>
                                <span className="font-bold">Phone: +971544765504</span>
                            </div>
                        </div>
                        <div className="my-5 table-responsive">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-5 mb-2">
                                <h1 className="text-lg font-bold mt-5">Items Details</h1>
                                {LPODetail?.raw_materials?.filter((item: any) => item.status === 'Pending' || item.status === 'Partial').length > 0 && (
                                    <Button
                                        type={ButtonType.button}
                                        text="Bulk Mark Complete"
                                        variant={ButtonVariant.primary}
                                        size={ButtonSize.small}
                                        onClick={() => handleMarkComplete()}
                                    />
                                )}
                            </div>
                            <table className="w-full text-[12px]">
                                <thead className="text-[12px]">
                                <tr>
                                    <th className="text-[12px]">
                                        {LPODetail?.raw_materials?.filter((item: any) => item.status === 'Pending' || item.status === 'Partial').length > 0 && (
                                            <Option
                                                label=""
                                                type="checkbox"
                                                name="bulk_select"
                                                defaultChecked={selectedItems.length === LPODetail?.raw_materials?.length}
                                                value={1}
                                                onChange={handleSelectAllClick}
                                            />
                                        )}
                                    </th>
                                    <th className="text-[12px]">#</th>
                                    <th className="text-[12px]">PR</th>
                                    <th className="text-[12px]">Item</th>
                                    <th className="text-[12px]">Unit</th>
                                    {/*<th>Description</th>*/}
                                    <th className="text-[12px]">Unit Price</th>
                                    <th className="text-[12px]">Qty</th>
                                    <th className="text-[12px]">Tax</th>
                                    <th className="text-[12px]">Total</th>
                                    {LPODetail?.raw_materials?.filter((item: any) => item.status === 'Pending' || item.status === 'Partial').length > 0 && (
                                        <th className="text-[12px]">Actions</th>
                                    )}
                                </tr>
                                </thead>
                                <tbody className="text-[12px]">
                                {LPODetail?.raw_materials?.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>
                                            {(item.status === 'Pending' || item.status === 'Partial') ? (
                                                <div className="flex gap-3 items-center">
                                                    <Option
                                                        label=""
                                                        type="checkbox"
                                                        name="bulk_select"
                                                        defaultChecked={selectedItems.includes(item.id)}
                                                        value={item.id}
                                                        onChange={(e) => handleSelectItemClick(item.id, e.target.checked)}
                                                    />
                                                    {item.status}
                                                </div>
                                            ) : (
                                                <div className="flex gap-3 items-center">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M3.74181 20.5545C4.94143 22 7.17414 22 11.6395 22H12.3607C16.8261 22 19.0589 22 20.2585 20.5545M3.74181 20.5545C2.54219 19.1091 2.95365 16.9146 3.77657 12.5257C4.36179 9.40452 4.65441 7.84393 5.7653 6.92196M3.74181 20.5545C3.74181 20.5545 3.74181 20.5545 3.74181 20.5545ZM20.2585 20.5545C21.4581 19.1091 21.0466 16.9146 20.2237 12.5257C19.6385 9.40452 19.3459 7.84393 18.235 6.92196M20.2585 20.5545C20.2585 20.5545 20.2585 20.5545 20.2585 20.5545ZM18.235 6.92196C17.1241 6 15.5363 6 12.3607 6H11.6395C8.46398 6 6.8762 6 5.7653 6.92196M18.235 6.92196C18.235 6.92196 18.235 6.92196 18.235 6.92196ZM5.7653 6.92196C5.7653 6.92196 5.7653 6.92196 5.7653 6.92196Z"
                                                            stroke="currentColor" strokeWidth="1.5" />
                                                        <path
                                                            d="M10 14.3C10.5207 14.7686 10.8126 15.0314 11.3333 15.5L14 12.5"
                                                            stroke="currentColor" strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round" />
                                                        <path
                                                            d="M9 6V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V6"
                                                            stroke="currentColor" strokeWidth="1.5"
                                                            strokeLinecap="round" />
                                                    </svg>
                                                    {item.status}
                                                </div>

                                            )}
                                        </td>
                                        <td className="text-[12px]">{index + 1}</td>
                                        <td className="text-[12px]">
                                            <div className="flex flex-col">
                                                <span>
                                                    <strong>PR: </strong>
                                                    {item.purchase_requisition?.pr_code}
                                                </span>
                                                <span>
                                                    <strong>By: </strong>
                                                    {item.purchase_requisition?.employee?.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-[12px]">{item.raw_product?.item_code}</td>
                                        <td className="text-[12px]">{item.unit?.name}</td>
                                        {/*<td>{item.description}</td>*/}
                                        <td className="text-[12px]">{item.unit_price.toFixed(2)}</td>
                                        <td className="text-[12px]">
                                            <div className="flex flex-col">
                                                <span>
                                                    <strong>Requested: </strong>
                                                    {item.request_quantity}
                                                </span>
                                                <span>
                                                    <strong>Received: </strong>
                                                    {item.processed_quantity}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-[12px]">
                                            <div className="flex flex-col">
                                                <span>
                                                    <strong>Category: </strong>
                                                    {item.tax_category ? item.tax_category.name : 'None'}
                                                </span>
                                                <span>
                                                    <strong>Rate: </strong>
                                                    {item.tax_rate.toFixed(2)}
                                                </span>
                                                <span>
                                                    <strong>Amount: </strong>
                                                    {item.tax_amount.toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-[12px]">{(parseFloat(item.processed_quantity) * parseFloat(item.unit_price)).toFixed(2)}</td>
                                        {LPODetail?.raw_materials?.filter((item: any) => item.status === 'Pending' || item.status === 'Partial').length > 0 && (
                                            <td>
                                                {(item.status === 'Pending' || item.status === 'Partial') && (
                                                    <Button
                                                        type={ButtonType.button}
                                                        text="Mark Complete"
                                                        variant={ButtonVariant.primary}
                                                        size={ButtonSize.small}
                                                        onClick={() => handleMarkComplete()}
                                                    />
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                </tbody>
                                {/*<tfoot className="text-[12px]">*/}
                                {/*<tr>*/}
                                {/*    <td colSpan={8} className="text-right">*/}
                                {/*        Total Without Tax*/}
                                {/*    </td>*/}
                                {/*    <td className="text-left ps-5">*/}
                                {/*        {LPODetail?.items?.reduce((acc: number, item: any) => acc + item.sub_total, 0).toFixed(2)}*/}
                                {/*    </td>*/}
                                {/*</tr>*/}
                                {/*<tr>*/}
                                {/*    <td colSpan={8} className="text-right">*/}
                                {/*        VAT*/}
                                {/*    </td>*/}
                                {/*    <td className="text-left ps-5">*/}
                                {/*        {LPODetail?.items?.reduce((acc: number, item: any) => acc + item.tax_amount, 0).toFixed(2)}*/}
                                {/*    </td>*/}
                                {/*</tr>*/}
                                {/*<tr>*/}
                                {/*    <td colSpan={8} className="text-right">*/}
                                {/*        Grand Total*/}
                                {/*    </td>*/}
                                {/*    <td className="text-left ps-5">*/}
                                {/*        {LPODetail?.items?.reduce((acc: number, item: any) => acc + (parseFloat(item.processed_quantity) * parseFloat(item.unit_price)), 0).toFixed(2)}*/}
                                {/*    </td>*/}
                                {/*</tr>*/}
                                {/*</tfoot>*/}
                            </table>
                        </div>
                        <div className="p-2.5">
                            <div>
                                <span className="font-bold mt-5">Terms and Conditions</span>
                                <div dangerouslySetInnerHTML={{ __html: LPODetail?.terms_conditions }} />
                            </div>
                        </div>
                    </div>
                )}
            </PageWrapper>
        </div>
    );
};

// View.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;
export default View;
