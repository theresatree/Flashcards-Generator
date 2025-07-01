import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeGenerator({ value }: { value: string }) {
  return (
    <div className="p-4 flex justify-center">
      <QRCodeCanvas
        value={value}
        size={400}               // Size in pixels
        bgColor="#ffffff"        // Background color
        fgColor="#000000"        // QR color
        level="L"                // Error correction level: L, M, Q, H
        includeMargin={true}     // Optional padding
      />
    </div>
  );
}
