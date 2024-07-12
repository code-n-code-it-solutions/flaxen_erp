import {PropsWithChildren, useEffect} from 'react';
import App from '../../App';
import {useSelector} from "react-redux";
import {IRootState} from "@/store";
import {useRouter} from "next/router";
import {checkServerSideAuth} from "@/utils/authCheck";

const BlankLayout = ({children}: PropsWithChildren) => {
    const token = useSelector((state: IRootState) => state.user.token);
    const router = useRouter();

    // useEffect(() => {
    //     if (token) {
    //         checkServerSideAuth(token).then(r => {
    //             if (r) {
    //                 router.push('/erp/main');
    //             }
    //         });
    //     }
    // }, [token, router])

    return (
        <App>
            <div className="min-h-screen text-black dark:text-white-dark">{children} </div>
        </App>
    );
};

export default BlankLayout;
