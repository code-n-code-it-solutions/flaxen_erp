import { useMemo } from 'react';

const transformToSelectOptions = (accounts: any[]) => {
    return accounts?.map((account) => {
        const transformed: any = {
            title: account.code + ' - ' + account.name,
            value: account.code,
        };

        if (account.accounts?.length>0 || account.children_recursive?.length>0) {
            transformed.children = transformToSelectOptions(account.accounts ?? account.children_recursive);
            transformed.disabled = true;
        } else {
            transformed.isLeaf = true;
        }

        return transformed;
    });
};

const useTransformToSelectOptions = (accounts: any[]) => {
    return useMemo(() => transformToSelectOptions(accounts), [accounts]);
};

export default useTransformToSelectOptions;
