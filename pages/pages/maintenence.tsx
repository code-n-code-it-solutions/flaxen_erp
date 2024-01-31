import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { setPageTitle } from '../../store/slices/themeConfigSlice';
import BlankLayout from '@/components/Layouts/BlankLayout';

const Maintenence = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Maintenance'));
    });
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-t from-[#c39be3] to-[#f2eafa]">
            <div className="p-5 text-center">
                <h2 className="mb-10 text-3xl font-bold md:text-5xl">Under Maintenance</h2>
                <h4 className="mb-5 text-xl font-semibold text-primary sm:text-2xl">Thank you for visiting us.</h4>
                <p className="text-base">
                    We are currently working on making some improvements <br className="hidden sm:block" />
                    to give you better user experience. <br /> <br />
                    Please visit us again shortly.
                </p>
                <Link href="/" className="btn btn-primary mx-auto mt-5 w-max">
                    Home
                </Link>
            </div>
        </div>
    );
};
Maintenence.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default Maintenence;
