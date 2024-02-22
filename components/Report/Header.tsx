import React from 'react';
import Image from "next/image";

const Header = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 20px",
                borderBottom: "1px solid #22AAA7",
                paddingBottom: "5px",
                height: "110px",
            }}>
            <img src="https://flaxenpaints.com/uploads/settings/logo2.png" alt="logo" width={150} height={80} />
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "end",
                    flexDirection: "column",
                    color: "#22AAA7",
                }}>
                <span
                    style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                    }}>
                    Flaxen Paints Industry LLC
                </span>
                <span style={{fontWeight: "bold"}}>info@flaxenpaints.com</span>
                <span style={{fontWeight: "bold"}}>+971 4 333 4444</span>
                <span
                    style={{
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <span style={{fontWeight: "bold"}}>P.O. Box 12345</span>
                    <span style={{fontWeight: "bold"}}>Dubai, UAE</span>
                </span>
            </div>
        </div>
    );
};

export default Header;
