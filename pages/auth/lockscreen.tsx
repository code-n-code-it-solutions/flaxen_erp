import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { clearIsLocked, logoutUser, resetAuthError, unLockedUser } from '@/store/slices/userSlice';
import { setAuthToken } from '@/configs/api.config';

const UnlockBox = () => {
    const dispatch = useAppDispatch();
    const { user, token, isLoggedIn, loading, isLocked, beforeLockedUrl, error } = useAppSelector(state => state.user);

    const [password, setPassword] = useState('');

    useEffect(() => {
        setAuthToken(token);
        dispatch(setPageTitle('Unlock Box'));
    }, []);

    const router = useRouter();
    const isDark = useAppSelector((state) => state.themeConfig.theme) === 'dark';

    const submitForm = (e: any) => {
        e.preventDefault();
        setAuthToken(token);
        dispatch(unLockedUser({ password }));
    };

    useEffect(() => {
        dispatch(resetAuthError());
    }, []);

    useEffect(() => {
        // console.log(isLocked);
        if (isLoggedIn && !isLocked) {
            router.push(beforeLockedUrl);
        }
    }, [isLocked]);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/auth/signin');
        }
    }, [isLoggedIn]);

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
            <div className="panel m-6 w-full max-w-lg sm:w-[480px]">
                {error && <div className="mb-5 p-4 bg-red-100 text-red-800 rounded-md text-center">{error}</div>}
                <div className="mb-10 flex items-center">
                    <div className="ltr:mr-4 rtl:ml-4">
                        <img src="/assets/images/default.jpeg" className="h-16 w-16 rounded-full object-cover"
                             alt="images" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-2xl">{user?.name}</h4>
                        <p>{user?.email}</p>
                        <p>Enter your password to unlock your ID</p>
                    </div>
                </div>
                <form className="space-y-5" onSubmit={(e) => submitForm(e)}>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="Enter Password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Loading...' : 'UNLOCK'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            dispatch(clearIsLocked());
                            dispatch(logoutUser());
                        }}
                        className="btn btn-danger w-full"
                    >
                        LOGOUT
                    </button>
                </form>
            </div>
        </div>
    );
};
UnlockBox.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default UnlockBox;
