'use client';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { useAppDispatch, useAppSelector } from '@/store';
import { getLPOByStatuses } from '@/store/slices/localPurchaseOrderSlice';
import { clearGoodReceiveNoteState, storeGRN } from '@/store/slices/goodReceiveNoteSlice';
import { clearUtilState, generateCode } from '@/store/slices/utilSlice';
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, IconType, RAW_PRODUCT_LIST_TYPE } from '@/utils/enums';
import { Dropdown } from '@/components/form/Dropdown';
import { Input } from '@/components/form/Input';
import RawProductItemListing from '@/components/listing/RawProductItemListing';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { Tab } from '@headlessui/react';
import { getAccountsTypes } from '@/store/slices/accountSlice';
import IconButton from '@/components/IconButton';
import { getIcon } from '@/utils/helper';
import AgGridComponent from '@/components/apps/AgGridComponent';
import { AgGridReact } from 'ag-grid-react';

interface IFormProps {
    id?: any;
}

const GoodReceiveNoteForm = ({ id }: IFormProps) => {
    const dispatch = useAppDispatch();
    const gridRef = useRef<AgGridReact<any>>(null);

    const { token, user } = useAppSelector(state => state.user);
    const { success, loading } = useAppSelector(state => state.goodReceiveNote);
    const { allLPOs } = useAppSelector(state => state.localPurchaseOrder);
    const { code, latestRecord } = useAppSelector(state => state.util);

    const [itemModalOpen, setItemModalOpen] = useState<boolean>(false);
    const [rawProductModalOpen, setRawProductModalOpen] = useState<boolean>(false);
    const [rawProductForSelect, setRawProductForSelect] = useState<any[]>([]);
    const [originalProductState, setOriginalProductState] = useState<any[]>([]);
    const [GRNItems, setGRNItems] = useState<any[]>([]);
    const [colDefs, setColDefs] = useState<any[]>([]);

    const [selectedLPOs, setSelectedLPOs] = useState<any[]>([]);
    const [formData, setFormData] = useState<any>({
        purchase_requisition_ids: '',
        local_purchase_order_ids: '',
        grn_number: '',
        received_by_id: 0,
        verified_by_id: 0,
        description: '',
        items: [],
        use_previous_accounting: 0
    });

    const [localPurchaseOrderOptions, setLocalPurchaseOrderOptions] = useState<any[]>([]);
    const [lpoDetails, setLPODetails] = useState<any>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token);
        // console.log(user)
        let finalData = {
            ...formData,
            purchase_requisition_ids: Array.from(new Set(GRNItems.map(item => item.purchase_requisition_id))).join(','),
            items: GRNItems
        };
        if (id) {
            // dispatch(updateRawProduct(id, formData));
        } else {
            // console.log(finalData)
            dispatch(storeGRN(finalData));
        }
    };

    const handleRemoveRow = (row: any) => {

    };

    const handleLPOChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setSelectedLPOs(e);
            let lpoIds = e.filter((item: any) => item.value !== 0).map((item: any) => item.value).join(',');
            let vendorId = e.filter((item: any) => item.value !== 0).map((item: any) => item.lpo.vendor_id);
            let vendorIdSet = new Set(vendorId);
            if (vendorIdSet.size > 1) {
                alert('You cannot select multiple vendors');
                return;
            }
            // console.log(e, lpoIds)
            setFormData((prev: any) => ({
                ...prev,
                local_purchase_order_ids: lpoIds,
                vendor_id: vendorId[0]
                // purchase_requisition_id: e.lpo.purchase_requisition_id,
                // received_by_id: e.lpo.received_by_id,
                // verified_by_id: e.lpo.received_by_id
            }));

            const allItems = e.filter((item: any) => item.value !== 0)
                .flatMap((item: any) => item.lpo.raw_materials.map((i: any) => ({
                    ...i,
                    quantity: i.remaining_quantity
                })));
            setRawProductForSelect(allItems);
        } else {
            setFormData((prev: any) => ({
                ...prev,
                local_purchase_order_ids: '',
                vendor_id: ''
            }));
            dispatch(clearGoodReceiveNoteState());
            setRawProductForSelect([]);
            setSelectedLPOs([]);
            setLPODetails({});
            setGRNItems([]);
        }
    };

    useEffect(() => {
        dispatch(clearGoodReceiveNoteState());
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getLPOByStatuses());
        dispatch(clearUtilState());
        dispatch(generateCode(FORM_CODE_TYPE.GOOD_RECEIVE_NOTE));
    }, []);

    useEffect(() => {
        setGRNItems([]);
        let columnDefinitions: any[] = [];
        if (formData.type === 'Material') {
            // console.log(GRNItems);
            columnDefinitions = [
                {
                    headerName: 'LPO',
                    field: 'local_purchase_order_id',
                    valueGetter: (params: any) => localPurchaseOrderOptions.find((item: any) => item.value === params.data.local_purchase_order_id)?.label,
                    cellRenderer: (params: any) => params.node?.rowPinned ? '' : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Product',
                    field: 'raw_product.title',
                    valueGetter: (params: any) => params.data.raw_product?.title + ' (' + params.data.raw_product?.item_code + ')',
                    cellRenderer: (params: any) => params.node?.rowPinned ? '' : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Qty',
                    field: 'quantity',
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Received Qty',
                    field: 'received_quantity',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                }
                // {
                //     headerName: 'Sub Total',
                //     field: 'sub_total',
                //     cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                //     minWidth: 150,
                //     filter: false,
                //     floatingFilter: false
                // },
                // {
                //     headerName: 'Tax@5%',
                //     field: 'tax_amount',
                //     cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                //     minWidth: 150,
                //     filter: false,
                //     floatingFilter: false
                // },
                // {
                //     headerName: 'Total',
                //     field: 'grand_total',
                //     cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                //     minWidth: 150,
                //     filter: false,
                //     floatingFilter: false
                // }
            ];
        } else if (formData.type === 'Service') {
            columnDefinitions = [
                {
                    headerName: 'Asset',
                    field: 'asset_id',
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Service',
                    field: 'service_name',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellRenderer: (params: any) => params.node?.rowPinned ? '' : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                },
                {
                    headerName: 'Description',
                    field: 'description',
                    editable: (params: any) => !params.node.rowPinned, // Disable editing in pinned row
                    cellRenderer: (params: any) => params.node?.rowPinned ? params.value : params.value,
                    minWidth: 150,
                    filter: false,
                    floatingFilter: false
                }
            ];
        }
        setColDefs([
            ...columnDefinitions,
            {
                headerName: '',
                field: 'remove',
                cellRenderer: (params: any) => (
                    !params.node?.rowPinned &&
                    <IconButton
                        color={ButtonVariant.danger}
                        icon={IconType.delete}
                        onClick={() => handleRemoveRow(params.data)}
                    />
                ),
                editable: false,
                filter: false,
                floatingFilter: false,
                sortable: false
            }
        ]);
    }, [formData.type]);

    useEffect(() => {
        if (code) {
            setFormData((prev: any) => ({
                ...prev,
                grn_number: code[FORM_CODE_TYPE.GOOD_RECEIVE_NOTE]
            }));
        }
    }, [code]);

    // useEffect(() => {
    //     if (!rawProductModalOpen) {
    //         setItemDetail({});
    //     }
    // }, [rawProductModalOpen]);

    // useEffect(() => {
    //     if (allLPOs) {
    //         setLocalPurchaseOrderOptions(allLPOs.map((lpo: any) => ({
    //             value: lpo.id,
    //             label: lpo.lpo_number,
    //             lpo: lpo
    //         })));
    //     }
    // }, [allLPOs]);

    return (
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col md:flex-row gap-3 justify-between items-start">
                <div className="flex justify-start flex-col items-start space-y-3 w-full">
                    <Input
                        divClasses="w-full"
                        label="Good Receive Note Number"
                        type="text"
                        name="grn_number"
                        value={formData.grn_number}
                        onChange={(e: any) =>
                            setFormData((prev: any) => ({
                                ...prev,
                                grn_number: e.target.value
                            }))}
                        placeholder="Good Receive Note Number"
                        isMasked={false}
                        disabled={true}
                    />

                    <Dropdown
                        divClasses="w-full"
                        label="Type"
                        name="type"
                        options={[
                            { value: 'Material', label: 'Material' },
                            { value: 'Service', label: 'Service' },
                            { value: 'Miscellaneous', label: 'Miscellaneous' }
                        ]}
                        value={formData.type}
                        onChange={(e: any) => {
                            setFormData((prev: any) => ({ ...prev, type: e?.value }));
                            if (allLPOs) {
                                setLocalPurchaseOrderOptions(
                                    allLPOs.filter((lpo: any) => lpo.type === e?.value).map((lpo: any) => ({
                                        value: lpo.id,
                                        label: lpo.lpo_number,
                                        lpo: lpo
                                    }))
                                );
                            }
                            if (typeof e?.value === 'undefined') {
                                setLocalPurchaseOrderOptions([]);
                            }
                        }}
                    />

                    <div className="flex justify-between items-end w-full gap-3">
                        <Dropdown
                            divClasses="w-full"
                            label="LPO"
                            name="local_purchase_order_ids"
                            options={localPurchaseOrderOptions}
                            value={formData.local_purchase_order_ids}
                            onChange={(e: any) => handleLPOChange(e)}
                            isMulti={true}
                        />
                        <Button
                            type={ButtonType.button}
                            text="Select Items"
                            variant={ButtonVariant.primary}
                            size={ButtonSize.small}
                            onClick={() => setItemModalOpen(true)}
                            disabled={rawProductForSelect.length === 0}
                        />
                    </div>

                </div>
                <div className="w-full p-5 border rounded hidden md:block">
                    <h1 className="font-bold text-lg mb-3">Instructions</h1>
                    <ul className="list-inside list-decimal space-y-2">
                        <li>Make sure to select the LPO first</li>
                        <li>Then select the status</li>
                        <li>Then you can check the items</li>
                    </ul>
                </div>
            </div>

            <Tab.Group>
                <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                            >
                                Details
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels className="rounded-none">
                    <Tab.Panel>
                        <div className="mt-5 table-responsive active">
                            <div
                                className="flex mb-3 justify-start items-start md:justify-between md:items-center gap-3 flex-col md:flex-row">
                                <div>
                                    <h3 className="text-lg font-semibold">Good Receive Items</h3>
                                    <span className="mt-1 text-info text-sm italic">
                                        Double click cell to enter data
                                    </span>
                                </div>
                            </div>
                            <AgGridComponent
                                gridRef={gridRef}
                                data={GRNItems}
                                colDefs={colDefs}
                                pagination={false}
                                // pinnedBottomRowData={pinnedBottomRowData}
                                height={400}
                            />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>


            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-3">
                <Button
                    type={ButtonType.submit}
                    text={loading ? 'Loading...' : 'Save Good Receive Note'}
                    variant={ButtonVariant.primary}
                    size={ButtonSize.medium}
                />

                <Button
                    text="Clear"
                    variant={ButtonVariant.info}
                    size={ButtonSize.medium}
                    onClick={() => window?.location?.reload()}
                />

            </div>

            <Modal
                // key={rawProductForSelect.length}
                show={itemModalOpen}
                setShow={setItemModalOpen}
                title="Select Items"
                size={'5xl'}
            >
                <table>
                    <thead>
                    <tr>
                        <th>PR</th>
                        <th>LPO</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rawProductForSelect.map((product: any, index: number) => (
                        <tr key={index}>
                            <td>{product.purchase_requisition?.pr_code}</td>
                            <td>{product.local_purchase_order?.lpo_number}</td>
                            <td>{product.raw_product?.item_code}</td>
                            <td>{product.quantity}</td>
                            <td>{product.unit_price}</td>
                            <td>
                                <Button
                                    type={ButtonType.button}
                                    text="Add"
                                    variant={ButtonVariant.primary}
                                    onClick={() => {

                                        setGRNItems([
                                            ...GRNItems,
                                            {
                                                status: 'Completed',
                                                purchase_requisition_id: product.purchase_requisition_id, // set the parent purchase requisition id
                                                local_purchase_order_id: product.local_purchase_order_id, // set the parent purchase requisition id
                                                raw_product: product.raw_product,
                                                raw_product_id: product.raw_product_id,
                                                quantity: parseInt(product.quantity),
                                                received_quantity: parseInt(product.quantity),
                                                unit_id: product.unit_id,
                                                unit_price: parseFloat(product.unit_price),
                                                sub_total: parseFloat(product.unit_price) * parseInt(product.quantity),
                                                description: product.description || '',
                                                tax_category_id: product.tax_category_id,
                                                tax_rate: product.tax_rate,
                                                tax_amount: product.tax_amount,
                                                grand_total: product.grand_total
                                            }
                                        ]);

                                        setOriginalProductState([
                                            ...originalProductState,
                                            product
                                        ]);

                                        setRawProductForSelect(rawProductForSelect.filter((item: any) => item.id !== product.id));
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Modal>
        </form>
    );
};

export default GoodReceiveNoteForm;
