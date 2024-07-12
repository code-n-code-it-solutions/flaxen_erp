import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {IRootState, useAppDispatch, useAppSelector} from "@/store";
import {AnyAction} from "redux";
import PageWrapper from "@/components/PageWrapper";
import Button from "@/components/Button";
import {ButtonSize, ButtonType, ButtonVariant, IconType} from "@/utils/enums";
import {getIcon} from "@/utils/helper";
import {setPageTitle} from "@/store/slices/themeConfigSlice";

const Index = () => {
    const dispatch = useAppDispatch();
    const {token} = useAppSelector((state) => state.user);
    const breadcrumb = [
        {
            title: 'Home',
            href: '/erp/main'
        },
        {
            title: 'Sale Dashboard',
            href: '/erp/sale'
        },
        {
            title: 'All Sale Invoices',
            href: '#'
        }
    ];

    useEffect(() => {
        dispatch(setPageTitle('All Sale Invoices'));
    }, []);

    return (
        <PageWrapper
            embedLoader={false}
            breadCrumbItems={breadcrumb}
        >
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">All Sale Invoices</h5>
                <Button
                    type={ButtonType.link}
                    text={
                        <span className="flex items-center">
                            {getIcon(IconType.add)}
                            Add New
                        </span>
                    }
                    variant={ButtonVariant.primary}
                    link={'/erp/sale/sale-invoice/create'}
                    size={ButtonSize.small}
                />
            </div>
        </PageWrapper>
    );
};

export default Index;
