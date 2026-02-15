"use client";

import QRCode from "react-qr-code";

interface WorkQRCodeProps {
    url: string;
}

export default function WorkQRCode({ url }: WorkQRCodeProps) {
    return (
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
            <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={url}
                viewBox={`0 0 256 256`}
            />
        </div>
    );
}
