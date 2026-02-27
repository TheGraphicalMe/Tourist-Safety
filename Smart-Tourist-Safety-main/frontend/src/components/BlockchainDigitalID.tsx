import React, { useState } from "react";
import { ethers } from "ethers";
import { QRCodeCanvas } from "qrcode.react";

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

const BlockchainDigitalID: React.FC = () => {
  const [touristId, setTouristId] = useState("");
  const [name, setName] = useState("");
  const [aadharPassport, setAadharPassport] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [status, setStatus] = useState("");
  const [digitalId, setDigitalId] = useState<DigitalId | null>(null);

  // ⚡ Blockchain setup — your provided details
  const RPC = "http://127.0.0.1:7545"; // Local Ganache RPC
  const contractAddress = "0x4b5787f994bba1d35fdaef2b7aa71dafc28f969a"; // your contract
  const privateKey =
    "0xd2a0f09a60c241e8bef92eaec7e17e7de99d25925bf2f3cdc06043e589766030"; // your ganache account

  // smart contract ABI
  const abi = [
    "function registerTourist(string touristID, string hashData) public",
    "function verifyTourist(string touristID, string hashData) public view returns (bool)",
  ];

  const getContract = (): ethers.Contract => {
    // ✅ ethers v5 syntax
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const wallet = new ethers.Wallet(privateKey, provider);
    return new ethers.Contract(contractAddress, abi, wallet);
  };

  const registerTourist = async () => {
    try {
      const registry = getContract();

      const touristData: TouristData = {
        touristId,
        name,
        aadharPassport,
        itinerary,
        emergencyContact,
        entryDate,
        exitDate,
      };

      // Create hash of touristData JSON
      const hash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(JSON.stringify(touristData))
      );

      setStatus("⏳ Registering on blockchain... please confirm TX");

      // Call smart contract
      const tx = await registry.registerTourist(touristId, hash);
      await tx.wait();

      // Save in state for display
      setDigitalId({
        ...touristData,
        hash,
        txHash: tx.hash,
      });

      setStatus("✅ Tourist Registered and Digital ID Generated");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Error: " + (err.message || err));
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>Smart Tourist Blockchain Digital ID</h2>

      {/* Registration form */}
      <div style={{ border: "1px solid black", padding: 20, marginBottom: 20 }}>
        <h3>📝 Register Tourist</h3>
        <input
          placeholder="Tourist ID"
          value={touristId}
          onChange={(e) => setTouristId(e.target.value)}
        />
        <br /><br />
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />
        <input
          placeholder="Aadhar / Passport"
          value={aadharPassport}
          onChange={(e) => setAadharPassport(e.target.value)}
        />
        <br /><br />
        <input
          placeholder="Itinerary"
          value={itinerary}
          onChange={(e) => setItinerary(e.target.value)}
        />
        <br /><br />
        <input
          placeholder="Emergency Contact"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
        />
        <br /><br />
        <label>Entry Date: </label>
        <input
          type="date"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
        />
        <br /><br />
        <label>Exit Date: </label>
        <input
          type="date"
          value={exitDate}
          onChange={(e) => setExitDate(e.target.value)}
        />
        <br /><br />

        <button onClick={registerTourist}>Register Tourist</button>
        <p>{status}</p>
      </div>

      {/* Show generated ID card */}
      {digitalId && (
        <div
          style={{
            border: "2px solid green",
            padding: 20,
            width: 450,
            backgroundColor: "#f0fff0",
          }}
        >
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
            <QRCodeCanvas value={JSON.stringify(digitalId)} size={180} />
            <p>📱 Scan QR to verify</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainDigitalID;