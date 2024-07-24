import React, { Fragment, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setAuthToken, setContentType } from '@/configs/api.config';
import { clearProductAssemblyState, getAssemblyItems, getProductAssemblies } from '@/store/slices/productAssemblySlice';
import { storeProduction, updateProduction } from '@/store/slices/productionSlice';
import { clearLatestRecord, clearUtilState, generateCode, getLatestRecord } from '@/store/slices/utilSlice';
import { ButtonType, ButtonVariant, FORM_CODE_TYPE, RAW_PRODUCT_LIST_TYPE } from '@/utils/enums';
import Alert from '@/components/Alert';
import Button from '@/components/Button';
import { Input } from '@/components/form/Input';
import { Dropdown } from '@/components/form/Dropdown';
import RawProductItemListing from '@/components/listing/RawProductItemListing';
import { Tab } from '@headlessui/react';
import Option from '@/components/form/Option';
import useTransformToSelectOptions from '@/hooks/useTransformToSelectOptions';
import { getAccountsTypes } from '@/store/slices/accountSlice';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';

const TreeSelect = dynamic(() => import('antd/es/tree-select'), { ssr: false });

interface IFormProps {
    id?: any;
}

const ProductionForm = ({ id }: IFormProps) => {
    const dispatch = useAppDispatch();
    const accountOptions = useTransformToSelectOptions(useAppSelector(state => state.account).accountTypes);
    const { token } = useAppSelector(state => state.user);
    const { code, latestRecord } = useAppSelector(state => state.util);
    const { allProductAssemblies, assemblyItems } = useAppSelector(state => state.productAssembly);
    const { productionDetail, loading } = useAppSelector(state => state.production);

    const [formData, setFormData] = useState<any>({});
    const [rawProducts, setRawProducts] = useState<any[]>([]);
    const [productAssemblyOptions, setProductAssemblyOptions] = useState<any>([]);
    const [messages, setMessages] = useState('Production can\'t be proceeding. Please purchase the In-stock quantities.');
    const [errorMessages, setErrorMessages] = useState<any>({});
    const [labReferenceOptions, setLabReferenceOptions] = useState<any[]>([]);

    const handleChange = (name: string, value: any, required: boolean) => {
        if (required && !value) {
            setErrorMessages((prev: any) => ({
                ...prev,
                [name]: 'This field is required'
            }));
        } else {
            setErrorMessages((prev: any) => {
                delete prev[name];
                return prev;
            });
        }

        switch (name) {
            case 'lab_reference':
                if (value && typeof value !== 'undefined') {
                    setFormData((prev: any) => ({
                        ...prev,
                        lab_reference: value.value
                    }));
                    // console.log(assemblyItems);
                    let rawProducts = assemblyItems
                        .flatMap((item: any) => {
                            if (item.lab_reference === value.value) {
                                return {
                                    raw_product_id: item.raw_product_id,
                                    description: item.description,
                                    unit_id: item.unit_id,
                                    unit_price: parseFloat(item.cost),
                                    quantity: parseFloat(item.quantity),
                                    available_quantity: parseFloat(item.available_stock),
                                    required_quantity: parseFloat(item.quantity) * parseFloat(formData.no_of_quantity),
                                    sub_total: (parseFloat(item.cost) * parseFloat(item.quantity) * parseFloat(formData.no_of_quantity)) / parseFloat(item.quantity)
                                };
                            } else {
                                return null;
                            }
                        })
                        .filter((item: any) => item !== null);
                    // console.log(rawProducts);
                    setRawProducts(rawProducts);
                } else {
                    setFormData((prev: any) => ({
                        ...prev,
                        lab_reference: ''
                    }));
                    setRawProducts([]);
                }
                break;
            case 'product_assembly_id':
                if (formData.no_of_quantity > 0) {
                    if (value && typeof value !== 'undefined') {
                        setAuthToken(token);
                        dispatch(getAssemblyItems(value.value));
                        setFormData((prev: any) => ({
                            ...prev,
                            product_assembly_id: value.value
                        }));
                    } else {
                        setFormData((prev: any) => ({
                            ...prev,
                            product_assembly_id: ''
                        }));
                        setRawProducts([]);
                        setLabReferenceOptions([]);
                    }
                } else {
                    alert('No of Quantity is required');
                }
                if (hasInsufficientQuantity()) {
                    setMessages('Production can\'t be proceeding. Please purchase the In-stock quantities.');
                }
                break;
            default:
                setFormData((prev: any) => ({
                    ...prev,
                    [name]: value
                }));
        }
    };

    const hasInsufficientQuantity = () => {
        return rawProducts.some((row) => row.available_quantity < row.required_quantity);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // setFormData((prev: any) => ({
        //     ...prev,
        //     production_items: rawProducts,
        // }));

        let finalData = {
            ...formData,
            production_items: rawProducts
        };

        setAuthToken(token);
        setContentType('application/json');
        dispatch(clearProductAssemblyState());
        if (!finalData.stock_account_id) {
            Swal.fire('Error', 'Please select accounting for stock', 'error');
        } else {
            if (id) {
                dispatch(updateProduction({ id, productionData: finalData }));
            } else {
                dispatch(storeProduction(finalData));
            }
        }
    };

    useEffect(() => {
        dispatch(getProductAssemblies());
        dispatch(getAccountsTypes({}));
        setRawProducts([]);
        if (!id) {
            dispatch(generateCode(FORM_CODE_TYPE.PRODUCTION));
        }
        return () => {
            dispatch(clearUtilState());
            dispatch(clearLatestRecord());
        };
    }, []);

    useEffect(() => {
        if (productionDetail) {
            let items = productionDetail.production_items.map((item: any) => ({
                raw_product_id: item.raw_product_id,
                description: item.description,
                unit_id: item.unit_id,
                unit_price: parseFloat(item.unit_cost),
                quantity: parseFloat(item.quantity),
                available_quantity: parseFloat(item.available_quantity),
                required_quantity: parseFloat(item.quantity) * parseFloat(productionDetail.no_of_quantity),
                sub_total: (parseFloat(item.unit_cost) * parseFloat(item.quantity) * parseFloat(productionDetail.no_of_quantity)) / parseFloat(item.quantity)
            }));

            setFormData((prev: any) => ({
                ...prev,
                batch_number: productionDetail.batch_number,
                no_of_quantity: productionDetail.no_of_quantity,
                product_assembly_id: productionDetail.product_assembly_id,
                production_items: items
            }));

            setRawProducts(items);
        }
    }, [productionDetail]);

    useEffect(() => {
        if (formData.no_of_quantity > 0) {
            let updatedRawProducts = rawProducts.map((row) => {
                return {
                    ...row,
                    required_quantity: parseFloat(row.quantity) * parseFloat(formData.no_of_quantity),
                    sub_total: (parseFloat(row.unit_price) * parseFloat(row.quantity) * parseFloat(formData.no_of_quantity)) / parseFloat(row.quantity)
                };
            });
            setRawProducts(updatedRawProducts);
        }
    }, [formData.no_of_quantity]);

    useEffect(() => {
        if (allProductAssemblies) {
            let formulaOptions = allProductAssemblies.map((assembly: any) => {
                return {
                    value: assembly.id,
                    label: assembly.formula_name + ' (' + assembly.color_code.name + ')'
                };
            });
            setProductAssemblyOptions([{ value: '', label: 'Select Formula' }, ...formulaOptions]);
        }
    }, [allProductAssemblies]);

    useEffect(() => {
        if (assemblyItems) {
            const labReferences = assemblyItems.map((item: any) => ({
                value: item.lab_reference,
                label: item.lab_reference
            }));
            const uniqueLabReferences = Array.from(new Set(labReferences.map((item: any) => item.value))).map(value => ({
                value,
                label: value
            }));
            setLabReferenceOptions(uniqueLabReferences);
        }
    }, [assemblyItems]);

    useEffect(() => {
        if (code) {
            setFormData((prev: any) => ({
                ...prev,
                batch_number: code[FORM_CODE_TYPE.PRODUCTION]
            }));
        }
    }, [code]);

    useEffect(() => {
        if (latestRecord) {
            setFormData((prevFormData: any) => ({
                ...prevFormData,
                stock_account_id: latestRecord.stock_account?.code,
                vat_receivable_id: latestRecord.vat_receivable?.code,
                account_payable_id: latestRecord.account_payable?.code,
                vat_payable_id: latestRecord.vat_payable?.code
            }));
        }
    }, [latestRecord]);

    // console.log(latestRecord);

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="mt-5">
                {hasInsufficientQuantity() &&
                    <Alert
                        alertType="error"
                        message={messages}
                        setMessages={setMessages}
                    />}
            </div>
            <div className="flex w-full flex-row items-start justify-between gap-3">
                <div className="flex w-full flex-col items-start justify-start space-y-3">
                    <Input
                        divClasses="w-full"
                        label="Batch Number"
                        type="text"
                        name="batch_number"
                        value={formData.batch_number}
                        onChange={(e) => handleChange(e.target.name, e.target.value, e.target.required)}
                        placeholder="Enter Batch Number"
                        isMasked={false}
                        disabled={true}
                    />

                    <Input
                        divClasses="w-full"
                        label="No of Quantity (KG)"
                        type="number"
                        name="no_of_quantity"
                        value={formData.no_of_quantity}
                        onChange={(e) => handleChange(e.target.name, Number(e.target.value), e.target.required)}
                        placeholder="Enter No of Quantity"
                        isMasked={false}
                        required={true}
                        errorMessage={errorMessages.no_of_quantity}
                    />

                    <Dropdown
                        divClasses="w-full"
                        label="Formula"
                        name="product_assembly_id"
                        options={productAssemblyOptions}
                        value={formData.product_assembly_id}
                        onChange={(e) => handleChange('product_assembly_id', e, true)}
                        required={true}
                        errorMessage={errorMessages.product_assembly_id}
                    />

                    <Dropdown
                        divClasses="w-full"
                        label="Lab Reference"
                        name="lab_reference"
                        options={labReferenceOptions}
                        value={formData.lab_reference}
                        onChange={(e) => handleChange('lab_reference', e, true)}
                        required={true}
                        errorMessage={errorMessages.lab_reference}
                    />

                </div>
                <div className="w-full border rounded p-5 hidden md:block">
                    <h5 className="text-lg font-semibold dark:text-white-light mb-3">Production Instructions</h5>
                    <ul className="list-decimal list-inside space-y-1">
                        <li>Make sure production have batch number</li>
                        <li>Choose a formula to produce</li>
                        <li>Enter the number off quantity to produce</li>
                        <li>Check the available quantities of raw products</li>
                        <li>Make sure the available quantities are enough to proceed</li>
                        <li>Make sure required fields are filled</li>
                        <li>Click on the submit button to proceed</li>
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
                                key={formData.no_of_quantity}
                                rawProducts={rawProducts}
                                setRawProducts={setRawProducts}
                                type={RAW_PRODUCT_LIST_TYPE.PRODUCTION}
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
                                defaultChecked={formData.use_previous_accounting}
                                onChange={(e) => {
                                    setFormData((prevFormData: any) => ({
                                        ...prevFormData,
                                        use_previous_accounting: e.target.checked ? 1 : 0
                                    }));
                                    dispatch(clearLatestRecord());
                                    if (e.target.checked) {
                                        dispatch(getLatestRecord('production'));
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
                                            <label>Stock Accounting</label>
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                value={latestRecord ? latestRecord.stock_account?.code : formData.stock_account_id}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select stock account"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(e) => handleChange('stock_account_id', e, true)}
                                                treeData={accountOptions}
                                                // onPopupScroll={onPopupScroll}
                                                treeNodeFilterProp="title"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>

            {!hasInsufficientQuantity() && (
                <Button
                    classes="!mt-6"
                    type={ButtonType.submit}
                    disabled={loading}
                    text={loading ? 'Processing...' : id ? 'Update' : 'Submit'}
                    variant={ButtonVariant.primary}
                />
            )}
        </form>
    );
};

export default ProductionForm;
