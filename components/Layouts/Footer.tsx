const Footer = () => {
    return (
        <div className="flex justify-end px-8">
            <p className="pt-6 text-center dark:text-white-dark ltr:sm:text-left rtl:sm:text-right">
                © {new Date().getFullYear()}.
                <a href="https://codencode.ae/" target="_blank" rel="noreferrer"
                   className="italic text-gray-500 hover:text-primary hover:underline ms-3">
                    Code N Code IT Solutions Co. LLC
                </a>. v1.0.0
            </p>
        </div>
    );
};

export default Footer;
