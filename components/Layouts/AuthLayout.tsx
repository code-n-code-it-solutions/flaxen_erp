import {PropsWithChildren, useEffect} from 'react';
import App from '../../App';
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "@/store";
import {useRouter} from "next/router";
import {checkServerSideAuth} from "@/utils/authCheck";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {logoutUser} from "@/store/slices/userSlice";

const AuthLayout = ({children}: PropsWithChildren) => {
    const {token, isLoggedIn} = useSelector((state: IRootState) => state.user);
    const router = useRouter();
    const dispatch = useDispatch<ThunkDispatch<IRootState, any, AnyAction>>();

    useEffect(() => {
        if (token) {
            // console.log(checkServerSideAuth(token))
            checkServerSideAuth(token)
                .then(r => {
                        // console.log('r', r)
                    if (r) {
                        router.push('/main');
                    } else {
                        dispatch(logoutUser());
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
