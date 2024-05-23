import {PropsWithChildren, useEffect} from 'react';
import App from '../../App';
import {useAppDispatch, useAppSelector} from "@/store";
import {useRouter} from "next/router";
import {checkServerSideAuth} from "@/utils/authCheck";
import {logoutUser} from "@/store/slices/userSlice";
import {clearMenuState} from "@/store/slices/menuSlice";

const AuthLayout = ({children}: PropsWithChildren) => {
    const {token, isLoggedIn, user} = useAppSelector((state) => state.user);
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (token) {
            // console.log(checkServerSideAuth(token))
            checkServerSideAuth(token)
                .then(r => {
                        // console.log('r', r)
                    if (r) {
                        if(user.roles.map((role:any) => role.name).includes('Admin')) {
                            router.push('/workspace');
                        } else {
                            router.push('/erp/main');
                        }

                    } else {
                        dispatch(logoutUser());
                        dispatch(clearMenuState());
                    }
                })
        }
    }, [token, router])

    useEffect(() => {
        // console.log(isLoggedIn)
        // if (isLoggedIn) {
        //     router.push('/main');
        // }
    }, [isLoggedIn, router])

    return (
        <App>
            <div className="min-h-screen text-black dark:text-white-dark">{children} </div>
        </App>
    );
};

export default AuthLayout;
