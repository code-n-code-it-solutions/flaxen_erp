import { useMemo } from 'react';

const transformToSelectOptions = (accounts: any) => {
    return accounts?.map((account: any) => {
        const transformed: any = {
            label: account.name,
            value: account.code
        };
        if (account.children) {
            transformed.options = transformToSelectOptions(account.children);
        }
        return transformed;
    });
};

const useTransformToSelectOptions = (accounts:any) => {
    return useMemo(() => transformToSelectOptions(accounts), [accounts]);
};

export default useTransformToSelectOptions;
