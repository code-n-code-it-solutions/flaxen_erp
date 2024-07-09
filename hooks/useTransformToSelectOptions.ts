import { useMemo } from 'react';

const transformToSelectOptions = (accounts: any) => {
    return accounts?.map((account: any) => {
        const transformed: any = {
            title: account.code + ' - ' + account.name,
            value: account.code
        };
        if (account.accounts || account.children_recursive) {
        // if (account.accounts) {
            transformed.children = transformToSelectOptions(account.accounts ?? account.children_recursive);
            // transformed.children = transformToSelectOptions(account.accounts);
        }
        return transformed;
    });
};

const useTransformToSelectOptions = (accounts: any) => {
    return useMemo(() => transformToSelectOptions(accounts), [accounts]);
};

export default useTransformToSelectOptions;
