import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store';
import { useEffect, useState } from 'react';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import { clearAuthState, loginUser, logoutUser } from '@/store/slices/userSlice';
import AuthLayout from '@/components/Layouts/AuthLayout';
import { clearMenuState } from '@/store/slices/menuSlice';
import { clearCompanySlice } from '@/store/slices/companySlice';
import { clearSettingState, getSettings } from '@/store/slices/settingSlice';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const { isLoggedIn, loading, error } = useAppSelector((state) => state.user);
    const { settings } = useAppSelector((state) => state.setting);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Login'));
        dispatch(clearSettingState());
        dispatch(getSettings());
        dispatch(clearAuthState());
    }, []);

    useEffect(() => {
        if (settings) {
            setIsMaintenanceMode(settings?.find((setting: any) => setting.key === 'maintenance_mode').value==='1');
        }
    }, [settings]);

    const submitForm = (e: any) => {
        e.preventDefault();
        dispatch(clearMenuState());
        dispatch(clearCompanySlice());
        dispatch(clearSettingState());
        dispatch(clearAuthState());
        dispatch(getSettings());
        if(isMaintenanceMode) {
            Swal.fire({
                icon: 'info',
                title: 'Maintenance Mode',
                text: 'The system is currently under maintenance. Please try again later.'
            });
        } else {
            dispatch(loginUser({ email, password, rememberMe }));
        }
    };

    return (
        !isLoggedIn &&
        <div
            className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
            <div className="panel m-6 w-full max-w-lg sm:w-[480px]">
                {isMaintenanceMode && (
                    <div className="mb-5 p-4 bg-yellow-100 text-yellow-800 rounded-md text-center">
                        The system is currently under maintenance. Please try again later.
                    </div>
                )}
                <h2 className="mb-3 text-2xl font-bold">Sign In</h2>
                <p className="mb-7">Enter your email and password to login</p>
                {error && <div className="mb-5 p-4 bg-red-100 text-red-800 rounded-md text-center">{error}</div>}
                <form className="space-y-5" onSubmit={submitForm}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="Enter Email"
                            required={true}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="Enter Password"
                            required={true}
                        />
                    </div>
                    <div>
                        <label className="cursor-pointer">
                            <input
                                type="checkbox"
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="form-checkbox"
                                checked={rememberMe}
                            />
                            <span className="text-white-dark">Remember Me</span>
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                    <p className="text-center">
                        Do not have an account yet?
                        <Link href="/auth/signup" className="font-bold text-primary hover:underline ltr:ml-1 rtl:mr-1">
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

Login.getLayout = (page: any) => {
    return <AuthLayout>{page}</AuthLayout>;
};
export default Login;
