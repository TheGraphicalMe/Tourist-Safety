import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  JsonRpcProvider,
  Wallet,
  Contract,
  keccak256,
  toUtf8Bytes,
} from "ethers";
import { QRCodeCanvas } from "qrcode.react";

// Type definitions
interface TouristData {
  touristId: string;
  name: string;
  aadharPassport: string;
  itinerary: string;
  emergencyContact: string;
  entryDate: string;
  exitDate: string;
}

interface DigitalId extends TouristData {
  hash: string;
  txHash: string;
}

const App: React.FC = () => {
  // Registration form states
  const [touristId, setTouristId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [aadharPassport, setAadharPassport] = useState<string>("");
  const [itinerary, setItinerary] = useState<string>("");
  const [emergencyContact, setEmergencyContact] = useState<string>("");
  const [entryDate, setEntryDate] = useState<string>("");
  const [exitDate, setExitDate] = useState<string>("");

  // Status and ID card
  const [status, setStatus] = useState<string>("");
  const [digitalId, setDigitalId] = useState<DigitalId | null>(null);
  const navigate = useNavigate();

  // ✅ Blockchain setup
  const RPC: string = "http://127.0.0.1:7545";
  const contractAddress: string = "0x4b5787f994bba1d35fdaef2b7aa71dafc28f969a"; // your deployed contract
  const privateKey: string = "0xd2a0f09a60c241e8bef92eaec7e17e7de99d25925bf2f3cdc06043e589766030"; // your Ganache private key

  const abi: string[] = [
    "function registerTourist(string touristID, string hashData) public",
    "function verifyTourist(string touristID, string hashData) public view returns (bool)"
  ];

  const getContract = (): Contract => {
    const provider = new JsonRpcProvider(RPC);
    const wallet = new Wallet(privateKey, provider);
    return new Contract(contractAddress, abi, wallet);
  };

  // Register Tourist
  const registerTourist = async (): Promise<void> => {
    try {
      const registry = getContract();

      // Prepare JSON of tourist details
      const touristData: TouristData = {
        touristId,
        name,
        aadharPassport,
        itinerary,
        emergencyContact,
        entryDate,
        exitDate,
      };

      const touristDataString = JSON.stringify(touristData);

      // Create hash
      const hash = keccak256(toUtf8Bytes(touristDataString));

      setStatus("⏳ Registering on blockchain...");
      const tx = await registry.registerTourist(touristId, hash);
      await tx.wait();

      // Save local card data
      setDigitalId({
        touristId,
        name,
        aadharPassport,
        itinerary,
        emergencyContact,
        entryDate,
        exitDate,
        hash,
        txHash: tx.hash,
      });

      setStatus("✅ Tourist Registered and Digital ID Generated");
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setStatus("❌ Error: " + errorMessage);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>Smart Tourist Registration & Digital ID</h2>

      {/* Registration Form */}
      <div style={{ border: "1px solid black", padding: 20, marginBottom: 20 }}>
        <h3>📝 Register Tourist</h3>
        <input 
          placeholder="Tourist ID" 
          value={touristId} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTouristId(e.target.value)} 
        /><br /><br />
        <input 
          placeholder="Name" 
          value={name} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
        /><br /><br />
        <input 
          placeholder="Aadhar/Passport" 
          value={aadharPassport} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAadharPassport(e.target.value)} 
        /><br /><br />
        <input 
          placeholder="Itinerary" 
          value={itinerary} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItinerary(e.target.value)} 
        /><br /><br />
        <input 
          placeholder="Emergency Contact" 
          value={emergencyContact} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmergencyContact(e.target.value)} 
        /><br /><br />
        <label>Entry Date: </label>
        <input 
          type="date" 
          value={entryDate} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEntryDate(e.target.value)} 
        /><br /><br />
        <label>Exit Date: </label>
        <input 
          type="date" 
          value={exitDate} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExitDate(e.target.value)} 
        /><br /><br />
        <button onClick={registerTourist}>Register Tourist</button>
        <button
          style={{ marginLeft: 10, background: '#007bff', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          onClick={() => navigate('/verify')}
        >
          Verify
        </button>
        <p>{status}</p>
      </div>

      {/* Digital ID Card */}
      {digitalId && (
        <div style={{ border: "2px solid green", padding: "20px", width: "450px", backgroundColor: "#f9fff9" }}>
          <h3>🌍 Digital Tourist ID</h3>
          <p><b>Tourist ID:</b> {digitalId.touristId}</p>
          <p><b>Name:</b> {digitalId.name}</p>
          <p><b>Aadhar/Passport:</b> {digitalId.aadharPassport}</p>
          <p><b>Itinerary:</b> {digitalId.itinerary}</p>
          <p><b>Emergency Contact:</b> {digitalId.emergencyContact}</p>
          <p><b>Valid:</b> {digitalId.entryDate} ➜ {digitalId.exitDate}</p>
          <p><b>Blockchain Hash:</b> {digitalId.hash}</p>
          <p><b>Tx Hash:</b> {digitalId.txHash}</p>
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <QRCodeCanvas
              value={JSON.stringify(digitalId)}
              size={180}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
            <p>📱 Scan QR to Verify</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;