import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useUser } from '../contexts/user-context';
import './scan.css';

const Scan = () => {
  const { userDetails } = useUser();

  if (!userDetails) {
    return <p className="loading-text">Loading...</p>;
  }

  const qrValue = userDetails.uid;

  return (
    <div className="scan-container">
      <div className="qr-card">
        <h2>Hi, {userDetails.name}</h2>
        <p className="qr-sub">Here’s your QR code:</p>
        <QRCodeCanvas
          value={qrValue}
          size={220}
          bgColor="#ffffff"
          fgColor="#ff4409"
          level="H"
        />
        <p className="qr-note">Show this at checkout to earn rewards</p>
      </div>
    </div>
  );
};

export default Scan;