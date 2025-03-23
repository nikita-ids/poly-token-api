import dotenv from "dotenv";
dotenv.config();

export const managers = [
  { id: 1, name: "Alice", privateKey: process.env.MANAGER_1_PRIVATE_KEY },
  { id: 2, name: "Bob", privateKey: process.env.MANAGER_2_PRIVATE_KEY },
  { id: 3, name: "Charlie", privateKey: process.env.MANAGER_3_PRIVATE_KEY },
  { id: 4, name: "David", privateKey: process.env.MANAGER_4_PRIVATE_KEY },
  { id: 5, name: "Eve", privateKey: process.env.MANAGER_5_PRIVATE_KEY },
];

export const assignRandomManager = () => {
  const availableManagers = managers.filter(m => m.privateKey); // Ensure private key exists
  if (availableManagers.length === 0) return null;
  return availableManagers[Math.floor(Math.random() * availableManagers.length)];
};
