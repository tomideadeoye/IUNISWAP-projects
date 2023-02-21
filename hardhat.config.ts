import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import "@nomicfoundation/hardhat-etherscan";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
	solidity: "0.8.17",

	networks: {
		hardhat: {
			forking: {
				//@ts-ignore
				url: process.env.MAINNET_RPC,
			},
		},

		goerli: {
			url: process.env.GOERLI_RPC,
			//@ts-ignore
			accounts: [process.env.PRIVATE_KEY2, process.env.PRIVATE_KEY1],
		},
		mumbai: {
			url: "https://matic-testnet-archive-rpc.bwarelabs.com",
			//@ts-ignore
			accounts: [process.env.PRIVATE_KEY],
		},
	},
};

// etherscan: {
//   apiKey: process.env.ETHERSCAN_APIKEY,
// }

export default config;
