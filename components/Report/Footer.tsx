import React from 'react';

const Footer = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                padding: "0 20px",
                borderTop: "1px solid #22AAA7",
                paddingTop: "5px",
                color: "#22AAA7",
                height: "30px",
            }}>
            <span>© 2021 Flaxen Paints Industry LLC</span>
            <span>www.flaxenpaints.com</span>
            <span>info@flaxenpaints.com</span>
        </div>
    );
};

export default Footer;
