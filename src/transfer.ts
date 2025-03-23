import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();
import abi from "../abi/PolyToken.json";



const { RPC_URL, TOKEN_CONTRACT, MANAGER_1_PRIVATE_KEY, MANAGER_2_PRIVATE_KEY, MANAGER_3_PRIVATE_KEY, MANAGER_4_PRIVATE_KEY, MANAGER_5_PRIVATE_KEY } = process.env;
// console.log("", RPC_URL,TOKEN_CONTRACT,MANAGER_1_PRIVATE_KEY, MANAGER_2_PRIVATE_KEY)

if (!RPC_URL || !TOKEN_CONTRACT || !MANAGER_1_PRIVATE_KEY ||  !MANAGER_2_PRIVATE_KEY || !MANAGER_3_PRIVATE_KEY || !MANAGER_4_PRIVATE_KEY || !MANAGER_5_PRIVATE_KEY) {
  throw new Error("Missing environment variables.");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const tokenContract = new ethers.Contract(TOKEN_CONTRACT, abi.output.abi, provider);

// const managerKeys = MANAGER_KEYS.split(","); // Read managers from ENV
// const managers = managerKeys.map((key) => new ethers.Wallet(key, provider));



// /**
//  * Convert amount to contract's decimal format
//  */
// const formatAmount = (amount: number) => {
//   return ethers.parseUnits(amount.toFixed(2), 2); // Convert to 2 decimals
// };

// /**
//  * Assign a manager (random selection)
//  */
const MANAGER_KEYS = [MANAGER_1_PRIVATE_KEY, MANAGER_2_PRIVATE_KEY, MANAGER_3_PRIVATE_KEY, MANAGER_4_PRIVATE_KEY, MANAGER_5_PRIVATE_KEY].filter(Boolean);
const getRandomManager = () => {
  const randomIndex = Math.floor(Math.random() * MANAGER_KEYS.length);
  return MANAGER_KEYS[randomIndex];
};

// /**
//  * Transfer ERC20 tokens
//  */
// **Static JSON for transfers**
const TRANSFERS = [
  { "to": "0xaC2C38d3990D7af19ccCeba5CE591BC9e0b30CCC", "amount": "1000" },
  { "to": "0x8283915f589eAdfdC66DDF172D4Bc91d00633354", "amount": "1000" },
  { "to": "0xaC2C38d3990D7af19ccCeba5CE591BC9e0b30CCC", "amount": "1000" },
  { "to": "0x8283915f589eAdfdC66DDF172D4Bc91d00633354", "amount": "1000" },
  { "to": "0xaC2C38d3990D7af19ccCeba5CE591BC9e0b30CCC", "amount": "1000" },
  { "to": "0x8283915f589eAdfdC66DDF172D4Bc91d00633354", "amount": "1000" },
  { "to": "0xaC2C38d3990D7af19ccCeba5CE591BC9e0b30CCC", "amount": "1000" },
  { "to": "0x8283915f589eAdfdC66DDF172D4Bc91d00633354", "amount": "1000" },
  { "to": "0x8283915f589eAdfdC66DDF172D4Bc91d00633354", "amount": "1000" },
  { "to": "0xaC2C38d3990D7af19ccCeba5CE591BC9e0b30CCC", "amount": "1000" }
];
export const transferTokens = async () => {
  console.log("CONTRACT ADDRESS", TOKEN_CONTRACT);
  
  const results = [];
  
  for (const { to, amount } of TRANSFERS) {
    try {
      const randomManager = getRandomManager(); // Select a random manager
      const wallet = new ethers.Wallet(randomManager, provider);
      const contract = new ethers.Contract(TOKEN_CONTRACT, abi.output.abi, wallet);

      // Convert amount to BigNumber with 18 decimals
      const formattedAmount = ethers.parseUnits(amount, 18);
      
      console.log(`Transferring ${amount} tokens to ${to} using manager ${wallet.address}...`);

      const tx = await contract.transfer(to, formattedAmount);
      await tx.wait(); // Wait for transaction to be confirmed

      console.log("TRANSACTION HASH", tx.hash);

      results.push({ to, manager: wallet.address, message: "Transfer successful", transactionHash: tx.hash });
    } catch (error) {
      console.error("Transfer failed:", error);
      results.push({ to, error: error || "Transfer failed" });
    }
  }

  return results; // ✅ RETURN results array
};
