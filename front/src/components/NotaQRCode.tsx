import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const NotaQRCode = ({ nota }: { nota: { id: number; titulo: string; texto: string; frase: string } }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const generarQRCode = async () => {
      const data = JSON.stringify(nota);
      const qrCode = await QRCode.toDataURL(data);
      setQrCodeUrl(qrCode);
    };
    generarQRCode();
  }, [nota]);

  return (
      <img src={qrCodeUrl} alt="QR Code" />
  );
};

export default NotaQRCode;
