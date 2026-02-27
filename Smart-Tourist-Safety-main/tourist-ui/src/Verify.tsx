import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { JsonRpcProvider, Wallet, Contract, keccak256, toUtf8Bytes } from "ethers";

// Define tourist data type
interface TouristData {
  touristId: string;
  name: string;
  aadharPassport: string;
  itinerary: string;
  emergencyContact: string;
  entryDate: string;
  exitDate: string;
}

const Verify: React.FC = () => {
  const [qrData, setQrData] = useState<string>("");
  const [verification, setVerification] = useState<string>("");

  // Blockchain details
  const RPC: string = "http://127.0.0.1:7545";
  const contractAddress: string = "0x4b5787f994bba1d35fdaef2b7aa71dafc28f969a";  
  const privateKey: string = "0xd2a0f09a60c241e8bef92eaec7e17e7de99d25925bf2f3cdc06043e589766030";

  const abi: string[] = [
    "function verifyTourist(string touristID, string hashData) public view returns (bool)"
  ];

  const getContract = (): Contract => {
    const provider = new JsonRpcProvider(RPC);
    const wallet = new Wallet(privateKey, provider);
    return new Contract(contractAddress, abi, wallet);
  };

  const handleScan = async (result: string | undefined): Promise<void> => {
    if (!result) return;
    try {
      setQrData(result);
      const parsed: TouristData = JSON.parse(result);

      // Recreate hash from tourist data object
      const touristDataString = JSON.stringify({
        touristId: parsed.touristId,
        name: parsed.name,
        aadharPassport: parsed.aadharPassport,
        itinerary: parsed.itinerary,
        emergencyContact: parsed.emergencyContact,
        entryDate: parsed.entryDate,
        exitDate: parsed.exitDate,
      });

      const hash = keccak256(toUtf8Bytes(touristDataString));
      const registry = getContract();
      const valid: boolean = await registry.verifyTourist(parsed.touristId, hash);

      const expired: boolean = new Date(parsed.exitDate) < new Date();

      if (valid && !expired) {
        setVerification(`✅ Tourist ${parsed.name} is VERIFIED and Active`);
      } else if (expired) {
        setVerification(`⚠ Tourist ${parsed.name}'s ID has Expired`);
      } else {
        setVerification(`❌ Verification Failed`);
      }
    } catch (err) {
      console.error(err);
      setVerification("❌ Invalid QR Code Data");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔍 Verify Tourist QR ID</h2>

      <QrScanner
        onDecode={(result: string) => handleScan(result)}
        onError={(err: Error) => console.error(err)}
        containerStyle={{ width: "300px", margin: "0 auto" }} // ✅ matches your earlier size
        videoStyle={{ width: "100%", borderRadius: "8px" }}
      />

      <p>📦 Scanned: {qrData}</p>
      <h3>{verification}</h3>
    </div>
  );
};

export default Verify;