import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect } from 'react';
import { setPageTitle } from '@/store/slices/themeConfigSlice';
import BlankLayout from '@/components/Layouts/BlankLayout';

const RecoverIdBox = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Recover Id Box'));
    }, []);
    const router = useRouter();
    const isDark = useAppSelector((state) => state.themeConfig.theme) === 'dark';

    const submitForm = (e: any) => {
        e.preventDefault();
        router.push('/');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
            <div className="panel m-6 w-full max-w-lg sm:w-[480px]">
                <h2 className="mb-3 text-2xl font-bold">Password Reset</h2>
                <p className="mb-7">Enter your email to recover your ID</p>
                <form className="space-y-5" onSubmit={submitForm}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" className="form-input" placeholder="Enter Email" />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        RECOVER
                    </button>
                </form>
            </div>
        </div>
    );
};
RecoverIdBox.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default RecoverIdBox;
