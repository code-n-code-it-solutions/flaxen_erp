'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { IRootState, useAppDispatch, useAppSelector } from '@/store';
import { AnyAction } from 'redux';
import { getLPOByStatuses } from '@/store/slices/localPurchaseOrderSlice';
import { clearGoodReceiveNoteState, storeGRN } from '@/store/slices/goodReceiveNoteSlice';
import { clearLatestRecord, clearUtilState, generateCode, getLatestRecord } from '@/store/slices/utilSlice';
import { ButtonSize, ButtonType, ButtonVariant, FORM_CODE_TYPE, RAW_PRODUCT_LIST_TYPE } from '@/utils/enums';
import { Dropdown } from '@/components/form/Dropdown';
import { Input } from '@/components/form/Input';
import RawProductItemListing from '@/components/listing/RawProductItemListing';
import ServiceItemListing from '@/components/listing/ServiceItemListing';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { Tab } from '@headlessui/react';
import Option from '@/components/form/Option';
import dynamic from 'next/dynamic';
import useTransformToSelectOptions from '@/hooks/useTransformToSelectOptions';
import { getAccountsTypes } from '@/store/slices/accountSlice';
import Swal from 'sweetalert2';

const TreeSelect = dynamic(() => import('antd/es/tree-select'), { ssr: false });

interface IFormData {
    purchase_requisition_ids: string;
    local_purchase_order_ids: string;
    grn_number: string;
    received_by_id: number;
    verified_by_id: number;
    status: string;
    description: string;
    items: any[];
    use_previous_accounting: number;
}

interface IFormProps {
    id?: any;
}

const GoodReceiveNoteForm = ({ id }: IFormProps) => {
    const dispatch = useAppDispatch();
    const accountOptions = useTransformToSelectOptions(useAppSelector(state => state.account).accountTypes);
    const { token, user } = useAppSelector(state => state.user);
    const { success, loading } = useAppSelector(state => state.goodReceiveNote);
    const { allLPOs } = useAppSelector(state => state.localPurchaseOrder);
    const { code, latestRecord } = useAppSelector(state => state.util);
    const [itemModalOpen, setItemModalOpen] = useState<boolean>(false);
    const [rawProductModalOpen, setRawProductModalOpen] = useState<boolean>(false);
    const [rawProductForSelect, setRawProductForSelect] = useState<any[]>([]);
    const [originalProductState, setOriginalProductState] = useState<any[]>([]);
    const [rawProducts, setRawProducts] = useState<any[]>([]);
    const [serviceItems, setServiceItems] = useState<any[]>([]);
    const [selectedLPOs, setSelectedLPOs] = useState<any[]>([]);
    const [formData, setFormData] = useState<any>({
        purchase_requisition_ids: '',
        local_purchase_order_ids: '',
        grn_number: '',
        received_by_id: 0,
        verified_by_id: 0,
        status: '',
        description: '',
        items: [],
        use_previous_accounting: 0
    });
    const [showItemDetail, setShowItemDetail] = useState<any>({
        show: false,
        type: null
    });
    const [localPurchaseOrderOptions, setLocalPurchaseOrderOptions] = useState<any[]>([]);
    const [lpoDetails, setLPODetails] = useState<any>({});

    const [showDetails, setShowDetails] = useState<boolean>(true);

    const [itemDetail, setItemDetail] = useState<any>({});
    const [statusOptions, setStatusOptions] = useState<any[]>([
        { value: '', label: 'Select Status' },
        { value: 'Draft', label: 'Draft' },
        { value: 'Pending', label: 'Proceed' }
    ]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthToken(token);
        // console.log(user)
        let finalData = {
            ...formData,
            user_id: user.id,
            purchase_requisition_ids: Array.from(new Set(rawProducts.map(item => item.purchase_requisition_id))).join(','),
            items: rawProducts.map((product: any) => {
                return {
                    local_purchase_order_id: product.local_purchase_order_id,
                    purchase_requisition_id: product.purchase_requisition_id,
                    raw_product_id: product.raw_product_id,
                    quantity: product.quantity,
                    received_quantity: product.received_quantity,
                    unit_id: product.unit_id,
                    unit_price: product.unit_price,
                    total: product.total,
                    description: product.description || '',
                    tax_category_id: product.tax_category_id,
                    tax_rate: product.tax_rate,
                    tax_amount: product.tax_amount,
                    discount_type: product.discount_type,
                    discount_amount_rate: product.discount_amount_rate,
                    row_total: product.row_total
                };
            })
        };
        if (id) {
            // dispatch(updateRawProduct(id, formData));
        } else {
            // console.log(finalData)
            if(!finalData.un_billed_account_payable_id) {
                Swal.fire('Error', 'Please select accounting for un billed account payable', 'error')
            } else {
                dispatch(storeGRN(finalData));
            }
        }
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
            setRawProducts([]);
        }
    };

    useEffect(() => {
        dispatch(clearGoodReceiveNoteState());
        setAuthToken(token);
        setContentType('application/json');
        dispatch(getLPOByStatuses());
        dispatch(clearUtilState());
        dispatch(generateCode(FORM_CODE_TYPE.GOOD_RECEIVE_NOTE));
        dispatch(clearLatestRecord());
        dispatch(getAccountsTypes({ids: 2}));
    }, []);

    useEffect(() => {
        if (code) {
            setFormData((prev: any) => ({
                ...prev,
                grn_number: code[FORM_CODE_TYPE.GOOD_RECEIVE_NOTE]
            }));
        }
    }, [code]);

    useEffect(() => {
        if (!rawProductModalOpen) {
            setItemDetail({});
        }
    }, [rawProductModalOpen]);

    useEffect(() => {
        if (allLPOs) {
            setLocalPurchaseOrderOptions(allLPOs.map((lpo: any) => ({
                value: lpo.id,
                label: lpo.lpo_number,
                lpo: lpo
            })));
        }
        // console.log(allLPOs)
    }, [allLPOs]);

    useEffect(() => {
        if (latestRecord) {
            setFormData((prevFormData: any) => ({
                ...prevFormData,
                un_billed_account_payable_id: latestRecord.un_billed_account_payable?.code,
            }));
            console.log(latestRecord);
        }
    }, [latestRecord]);

    // console.log(rawProductForSelect, rawProducts, originalProductState)

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

                    <Dropdown
                        divClasses="w-full"
                        label="Status"
                        name="status"
                        options={statusOptions}
                        value={formData.status}
                        onChange={(e: any) => {
                            if (e && typeof e !== 'undefined') {
                                setFormData((prev: any) => ({
                                    ...prev,
                                    status: e.value
                                }));
                            } else {
                                setFormData((prev: any) => ({
                                    ...prev,
                                    status: ''
                                }));
                            }
                        }}
                    />

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
                    {!id && (
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${
                                        selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''
                                    } -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                                >
                                    Accounting
                                </button>
                            )}
                        </Tab>
                    )}
                </Tab.List>
                <Tab.Panels className="panel rounded-none">
                    <Tab.Panel>
                        <div className="active">
                            <RawProductItemListing
                                rawProducts={rawProducts}
                                originalProducts={originalProductState}
                                setRawProducts={setRawProducts}
                                type={RAW_PRODUCT_LIST_TYPE.GOOD_RECEIVE_NOTE}
                            />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div>
                            <Option
                                divClasses="mb-5"
                                label="Use Previous Item Accounting"
                                type="checkbox"
                                name="use_previous_accounting"
                                value="1"
                                defaultChecked={formData.use_previous_accounting === 1}
                                onChange={(e) => {
                                    setFormData((prevFormData: any) => ({
                                        ...prevFormData,
                                        use_previous_accounting: e.target.checked ? 1 : 0
                                    }));
                                    dispatch(clearLatestRecord());
                                    if (e.target.checked) {
                                        dispatch(getLatestRecord('good-receive-note'));
                                    } else {
                                        dispatch(clearLatestRecord());
                                    }
                                }}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <h3 className="font-bold text-lg mb-5 border-b">Accounts</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label>Un-Billed Account Payable</label>
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                value={latestRecord ? latestRecord.un_billed_account_payable?.code : formData.un_billed_account_payable_id}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select Un Billed Account"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(e) => {
                                                    setFormData((prevFormData: any) => ({
                                                        ...prevFormData,
                                                        un_billed_account_payable_id: e
                                                    }));
                                                }}
                                                treeData={accountOptions}
                                                // onPopupScroll={onPopupScroll}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
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

                                        setRawProducts([
                                            ...rawProducts,
                                            {
                                                status: 'Completed',
                                                purchase_requisition_id: product.purchase_requisition_id, // set the parent purchase requisition id
                                                local_purchase_order_id: product.local_purchase_order_id, // set the parent purchase requisition id
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