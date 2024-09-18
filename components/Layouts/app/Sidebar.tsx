import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '@/store/slices/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState, useAppSelector } from '@/store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getIcon } from '@/utils/helper';
import { IconType } from '@/utils/enums';

const Sidebar = ({ menus }: { menus: any[] }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const { selectedPlugin } = useAppSelector((state) => state.plugin);

    const toggleMenu = (value: string) => {
        // console.log(value);
        setCurrentMenu((oldValue) => (oldValue === value ? '' : value));
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window?.location?.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [router.pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }

        const selector = document.querySelector('.sidebar ul a[href="' + window?.location?.pathname + '"]');
        selector?.classList.add('active');
    };

    const renderSubMenu = (subMenus: any[]) => {
        return subMenus && subMenus.map((subMenu, subMenuIndex) => (
            <li className="menu nav-item" key={subMenuIndex}>
                {subMenu.children?.length > 0 ? (
                    <>
                        <button
                            type="button"
                            className={`${currentMenu === subMenu.translation_key + subMenuIndex ? 'active' : ''} nav-link group w-full`}
                            onClick={() => toggleMenu(subMenu.translation_key + subMenuIndex)}
                        >
                            <div className="flex items-center">
                                <span
                                    className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                    {t(subMenu.translation_key)}
                                </span>
                            </div>
                            <div
                                className={currentMenu === subMenu.translation_key + subMenuIndex ? 'rotate-90' : 'rtl:rotate-180'}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5"
                                          strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </button>
                        <AnimateHeight
                            duration={300}
                            height={currentMenu === subMenu.translation_key + subMenuIndex ? 'auto' : 0}
                        >
                            <ul className="sub-menu text-gray-500">
                                {renderSubMenu(subMenu.children)}
                            </ul>
                        </AnimateHeight>
                    </>
                ) : (
                    <Link href={subMenu.route || ''} key={subMenuIndex}>
                        {t(subMenu.translation_key)}
                    </Link>
                )}
            </li>
        ));
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed top-0 bottom-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}>
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <span
                                className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">
                                <div className="flex items-center gap-1">
                                    {getIcon(IconType.back)}
                                    {selectedPlugin?.name || 'App'}
                                </div>
                            </span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg" className="m-auto h-5 w-5">
                                <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round" />
                                <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor"
                                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                            {menus && menus.map((menu, menuIndex) => (
                                <li className="menu nav-item" key={menuIndex}>
                                    {menu.children?.length > 0 ? (
                                        <>
                                            <button
                                                type="button"
                                                className={`${currentMenu === menu.translation_key + menuIndex ? 'active' : ''} nav-link group w-full`}
                                                onClick={() => toggleMenu(menu.translation_key + menuIndex)}
                                            >
                                                <div className="flex items-center">
                                                    <span
                                                        className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                        {t(menu.translation_key)}
                                                    </span>
                                                </div>
                                                <div
                                                    className={currentMenu === menu.translation_key + menuIndex ? 'rotate-90' : 'rtl:rotate-180'}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 5L15 12L9 19" stroke="currentColor"
                                                              strokeWidth="1.5" strokeLinecap="round"
                                                              strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </button>
                                            <AnimateHeight
                                                duration={300}

                                                height={currentMenu === menu.translation_key + menuIndex ? 'auto' : 0}
                                            >
                                                <ul className="sub-menu text-gray-500">
                                                    {renderSubMenu(menu.children)}
                                                </ul>
                                            </AnimateHeight>
                                        </>
                                    ) : (
                                        <Link href={menu.route || ''} key={menuIndex}>
                                            {t(menu.translation_key)}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
