import { Network, Alchemy } from "alchemy-sdk";
import * as dotenv from "dotenv";
import { parseEther } from "frog";
import { formatEther } from "viem";

dotenv.config();

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
  network: Network.OPT_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const PulpaTokenAddress = "0x029263aA1BE88127f1794780D9eEF453221C2f30";

export async function getPulpaBalance(address: string) {
  const response = await alchemy.core.getTokenBalances(address, [
    PulpaTokenAddress,
  ]);
  return formatEther(BigInt(response.tokenBalances[0].tokenBalance ?? ""));
}
