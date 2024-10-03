import { PropsWithChildren, useEffect } from 'react';
import App from '../../App';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/router';
import { checkServerSideAuth } from '@/utils/authCheck';
import { logoutUser } from '@/store/slices/userSlice';
import { clearMenuState } from '@/store/slices/menuSlice';
import { getBranches, setSelectedBranch, setSelectedCompany } from '@/store/slices/companySlice';

const AuthLayout = ({ children }: PropsWithChildren) => {
    const { token, isLoggedIn, user, isLocked } = useAppSelector((state) => state.user);
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (token) {
            // console.log(checkServerSideAuth(token))
            checkServerSideAuth(token)
                .then(r => {
                    // console.log('r', r)
                    if (r) {
                        dispatch(setSelectedCompany(user.registered_company));
                        dispatch(setSelectedBranch(user.registered_branch));
                        if(!isLocked) {
                            if (user.roles.map((role: any) => role.name).includes('Super Admin')) {
                                router.push('/super-admin');
                            } else if (user.roles.map((role: any) => role.name).includes('Company Admin')) {
                                router.push('/workspace');
                            } else {
                                router.push('/apps');
                            }
                            dispatch(getBranches(user.id));
                        }
                    } else {
                        dispatch(logoutUser());
                        dispatch(clearMenuState());
                    }
                });
        }
    }, [token, router]);



    return (
        <App>
            <div className="min-h-screen text-black dark:text-white-dark">{children} </div>
        </App>
    );
};

export default AuthLayout;
