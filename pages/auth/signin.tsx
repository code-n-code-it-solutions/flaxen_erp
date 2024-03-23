import Link from 'next/link';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState, AppDispatch} from '@/store';
import {useEffect, useState} from 'react';
import {setPageTitle} from '@/store/slices/themeConfigSlice';
import {useRouter} from 'next/router';
import {loginUser, logoutUser} from '@/store/slices/userSlice';
import {ThunkDispatch} from "redux-thunk";
import { AnyAction } from 'redux';
import AuthLayout from "@/components/Layouts/AuthLayout";
import {setActiveModule} from "@/store/slices/menuSlice";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const {isLoggedIn, loading} = useSelector((state: IRootState) => state.user);

    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();
    useEffect(() => {
        dispatch(setPageTitle('Login'));
    }, []);

    const submitForm = (e: any) => {
        e.preventDefault();
        dispatch(loginUser({email, password, rememberMe}));
        // router.push('/');
    };

    // useEffect(() => {
    //     if (isLoggedIn) {
    //         dispatch(setActiveModule('Home'))
    //     }
    // }, [isLoggedIn]);

    return (
        !isLoggedIn &&
        <div
            className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
            <div className="panel m-6 w-full max-w-lg sm:w-[480px]">
                <h2 className="mb-3 text-2xl font-bold">Sign In</h2>
                <p className="mb-7">Enter your email and password to login</p>
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
                </form>
            </div>
        </div>
    );
};
Login.getLayout = (page: any) => {
    return <AuthLayout>{page}</AuthLayout>;
};
export default Login;
