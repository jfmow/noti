// components/QRCodeComponent.js
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRCodeComponent = ({ text }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, text, { errorCorrectionLevel: 'H' }, (error) => {
                if (error) {
                    console.error(error);
                }
            });
        }
    }, [text]);

    return <canvas ref={canvasRef} />;
};

export default QRCodeComponent;
