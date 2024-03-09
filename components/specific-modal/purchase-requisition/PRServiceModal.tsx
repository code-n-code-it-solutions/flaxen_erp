import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import ImageUploader from "@/components/form/ImageUploader";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@/store";
import {clearUtilState, generateCode} from "@/store/slices/utilSlice";
import {FORM_CODE_TYPE} from "@/utils/enums";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import Select from "react-select";
import {getAssets, storeAssets} from "@/store/slices/assetSlice";
import AssetFormModal from "@/components/specific-modal/AssetFormModal";

interface IProps {
    modalOpen: boolean;
    setModalOpen: (value: boolean) => void;
    handleSubmit: (value: any) => void;
    modalFormData?: any;
}

const PRServiceModal = ({modalOpen, setModalOpen, handleSubmit, modalFormData}: IProps) => {
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    const [selectedAssets, setSelectedAssets] = useState<any>([]);
    const [assetIds, setAssetIds] = useState<string>('');
    const [assetNames, setAssetNames] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [assetOptions, setAssetOptions] = useState<any[]>([]);
    const [assetModalOpen, setAssetModalOpen] = useState<boolean>(false);
    const {assets, asset, loading, success} = useSelector((state: IRootState) => state.asset);

    const handleAssetSubmit = (val: any) => {
        dispatch(storeAssets(val));
    }

    const handleAssetChange = (e: any) => {
        if (e && typeof e !== 'undefined') {
            setAssetIds(e.map((item: any) => item.value).join(','));
            setAssetNames(e.map((item: any) => item.label).join(', '));
            setSelectedAssets(e);
            setQuantity(e.length)
        }
    }

    useEffect(() => {
        if (modalOpen) {
            setName('');
            setDescription('');
            setAssetIds('')
            setQuantity(0);
            setAssetNames('');
            setSelectedAssets([]);
            setAssetModalOpen(false)
            dispatch(getAssets());
        }
    }, [modalOpen]);

    useEffect(() => {
        if (assets) {
            setAssetOptions(assets.map((asset: any) => ({
                value: asset.id,
                label: asset.name+' ('+asset.code+')'
            })));
        }
    }, [assets]);

    useEffect(() => {
        if (asset && success) {
            setAssetModalOpen(false)
            dispatch(getAssets());
            dispatch(clearUtilState());
            dispatch(generateCode(FORM_CODE_TYPE.SERVICE));

        }
    }, [asset, success]);

    return (
        <Transition appear show={modalOpen} as={Fragment}>
            <Dialog as="div" open={modalOpen} onClose={() => setModalOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0"/>
                </Transition.Child>
                <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-start justify-center px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel as="div"
                                          className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div
                                    className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <div className="text-lg font-bold">{modalFormData ? 'Edit' : 'Add'} Service
                                    </div>
                                    <button type="button" className="text-white-dark hover:text-dark"
                                            onClick={() => setModalOpen(false)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-5 space-y-5">
                                    <div className="w-full">
                                        <div className="flex justify-between items-center w-full mb-1">
                                            <label htmlFor="asset_id">Assets</label>
                                            <button
                                                className="btn btn-primary btn-sm flex justify-center items-center"
                                                onClick={() => setAssetModalOpen(true)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24"
                                                     className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                                                     fill="none">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor"
                                                            strokeWidth="1.5"/>
                                                    <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                                                          stroke="currentColor"
                                                          strokeWidth="1.5" strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        </div>

                                        <Select
                                            defaultValue={assetOptions[0]}
                                            options={assetOptions}
                                            value={selectedAssets}
                                            isSearchable={true}
                                            isClearable={true}
                                            isMulti={true}
                                            placeholder={'Select Asset Type'}
                                            onChange={(e: any) => handleAssetChange(e)}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="name">Service Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="form-input"
                                            placeholder='Enter service name e.g Repairing, Cleaning etc.'
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="quantity">Quantity</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            id="quantity"
                                            className="form-input"
                                            placeholder='Quantity'
                                            disabled={true}
                                            value={quantity}
                                            onChange={e => setQuantity(e.target.valueAsNumber)}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="description">Description (Optional)</label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            className="form-input"
                                            placeholder='Service description'
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => setModalOpen(false)}
                                        >
                                            Discard
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                            onClick={() => handleSubmit({
                                                name,
                                                quantity,
                                                description,
                                                asset_ids: assetIds,
                                                asset_names: assetNames
                                            })}
                                        >
                                            {modalFormData ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
                <AssetFormModal
                    modalOpen={assetModalOpen}
                    setModalOpen={setAssetModalOpen}
                    handleSubmit={(val) => handleAssetSubmit(val)}
                />
            </Dialog>
        </Transition>
    );
};

export default PRServiceModal;
