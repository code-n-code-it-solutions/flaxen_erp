const Footer = () => {
    return (
        <div>
            <p className="pt-6 text-center dark:text-white-dark ltr:sm:text-left rtl:sm:text-right">
                © {new Date().getFullYear()}.
                <a href="https://flaxenpaints.com" rel='noreferrer'
                   className='italic text-gray-500 hover:text-primary hover:underline'> Flaxen
                    Paints LLC</a>.
                Design & Developed By
                <a href="http://suhaibzia.com" target='_blank' rel='noreferrer'
                   className='italic text-gray-500 hover:text-primary hover:underline'> Syed Suhaib Zia</a>
            </p>
        </div>
    );
};

export default Footer;
