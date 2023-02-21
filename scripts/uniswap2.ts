import { ethers } from "hardhat";

async function main() {
	// ADDRESSES
	const FACTORY = "0x5C69bEe701eF814a2B6a3EDD4B1652CB9cc5a6f";
	const ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; //uniswap router address
	const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; //dai token address
	const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"; //uni token address
	const DAIHolderToImpersonate = "0x748dE14197922c4Ae258c7939C7739f3ff1db573"; //dai holder
	const deadline = 1676588399;

	// IMPERSONATION
	const helpers = require("@nomicfoundation/hardhat-network-helpers");
	await helpers.impersonateAccount(DAIHolderToImpersonate);
	const impersonatedSigner = await ethers.getSigner(DAIHolderToImpersonate);

	// CONTRACTS
	const DaiContract = await ethers.getContractAt("IERC20", DAI);
	const UniContract = await ethers.getContractAt("IERC20", UNI);
	const Uniswap = await ethers.getContractAt("IUniswap", ROUTER);

	console.log(
		`BALANCES: DAI ${await DaiContract.balanceOf(
			DAIHolderToImpersonate // CHECKING BALANCES
		)} > UNI ${await UniContract.balanceOf(DAIHolderToImpersonate)}`
	);

	// SWAP
	const amountToSwap = await ethers.utils.parseEther("100");
	const DAIApproval = await DaiContract.connect(impersonatedSigner).approve(
		ROUTER,
		amountToSwap
	);
	const UniApproval = await UniContract.connect(impersonatedSigner).approve(
		ROUTER,
		amountToSwap
	);

	// ADD LIQUIDITY
	await Uniswap.connect(impersonatedSigner).addLiquidity(
		UNI,
		DAI,
		amountToSwap,
		amountToSwap,
		0,
		0,
		DAIHolderToImpersonate,
		deadline
	);

	console.log(
		`BALANCES: DAI ${await DaiContract.balanceOf(
			DAIHolderToImpersonate // CHECKING BALANCES
		)} > UNI ${await UniContract.balanceOf(DAIHolderToImpersonate)}`
	);

	// ADD LIQUIDITY ETH
	const approveEth = await DaiContract.connect(impersonatedSigner).approve(
		ROUTER,
		amountToSwap
	);
	console.log(
		`Pre Eth Balance: ${await ethers.provider.getBalance(
			DAIHolderToImpersonate
		)}`
	);

	await Uniswap.connect(impersonatedSigner).addLiquidityETH(
		DAI,
		amountToSwap,
		0,
		0,
		DAIHolderToImpersonate,
		deadline,
		{ value: amountToSwap }
	);

	console.log(
		`Post Eth Balance: ${await ethers.provider.getBalance(
			DAIHolderToImpersonate
		)}`
	);

	// REMOVE LIQUIDITY
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
