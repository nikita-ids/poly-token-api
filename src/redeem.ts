import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();
import abi from "../abi/TrustedForwarder_metadata.json"; // Adjust path if needed

const { RPC_URL, TRUSTED_FORWARDER, MANAGER_1_PRIVATE_KEY } = process.env;

if (!RPC_URL || !TRUSTED_FORWARDER || !MANAGER_1_PRIVATE_KEY) {
  throw new Error("Missing environment variables.");
}

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(MANAGER_1_PRIVATE_KEY, provider);
const forwarderContract = new ethers.Contract(TRUSTED_FORWARDER, abi.output.abi, wallet);

export const redeemTokens = async (
          from: string,
          to: string,
          value: string,
          gas: string,
          nonce: string,
          data: string,
          signature: string
        ) => {
          try {
            console.log("Relaying transaction for:", from, to, value,gas,data,signature);
        
            // ✅ Connect Relayer Wallet
            const RELAYER_PRIVATE_KEY = "b5455bc8df04bf98317786235b9c5aed28f2f76c3365df94c56039e1ac8e2df2";
            if (!RELAYER_PRIVATE_KEY) {
              throw new Error("Relayer private key is missing!");
            }
        
            // console.log("ABI",abi.output.abi)
            const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);
            const relayerWallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, rpcProvider);
            const forwarderWithRelayer = forwarderContract.connect(relayerWallet);
        
            const contract = new ethers.Contract(TRUSTED_FORWARDER, abi.output.abi, wallet);
            const tx = await contract.execute(
              { from, to, value, gas, nonce, data },
              signature,
              { gasLimit: 3000000 }
            )
            await tx.wait();
            
        
            return { success: true, txHash: tx.hash };
          // return { success: true, txHash:"233333"};
          } catch (err) {
            console.error("Relay error:", err);
            return { success: false, error: "Transaction failed.", details: err };
          }
        };
