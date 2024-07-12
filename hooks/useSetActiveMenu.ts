import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store';
import { findActiveMenu } from '@/utils/buttonUtils';
import { useRouter } from 'next/router';
import { truncatePathname } from '@/utils/helper';
import { setActiveMenu } from '@/store/slices/menuSlice'; // or use a custom hook for other state management libraries

const useSetActiveMenu = (appBasePath: string) => {
    const dispatch = useDispatch();
    const { permittedMenus } = useAppSelector(state => state.menu);
    const router = useRouter();

    useEffect(() => {
        const pathname = truncatePathname(router.pathname, appBasePath);
        const activeMenu = findActiveMenu(permittedMenus, pathname);
        if (activeMenu) {
            dispatch(setActiveMenu(activeMenu));
        }
    }, [dispatch, permittedMenus, router.pathname]);
};

export default useSetActiveMenu;
