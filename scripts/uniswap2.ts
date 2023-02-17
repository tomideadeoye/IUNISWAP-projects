import { ethers } from "hardhat";
import {
	ChainId,
	Token,
	WETH,
	Fetcher,
	Route,
	Trade,
	TokenAmount,
	TradeType,
	Percent,
	Pair,
} from "@uniswap/sdk";

async function main() {
	const ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; //uniswap router address
	const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; //dai token address
	const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"; //uni token address

	const paths = [DAI, "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", UNI];
	const path2 = ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", DAI];
	let time = 1676588399;

	const amountToSwap = await ethers.utils.parseEther("100");
	const amountToReceive = await ethers.utils.parseEther("100");
	console.log(
		`Amount to swap ${amountToSwap} => Amount to receive ${amountToReceive}`
	);

	const Uniswap = await ethers.getContractAt("IUniswap", ROUTER);

	const helpers = require("@nomicfoundation/hardhat-network-helpers");
	const DAIHolderImpersonated = "0x748dE14197922c4Ae258c7939C7739f3ff1db573"; //dai holder
	await helpers.impersonateAccount(DAIHolderImpersonated);
	const impersonatedSigner = await ethers.getSigner(DAIHolderImpersonated);

	const DaiContract = await ethers.getContractAt("IERC20", DAI);
	const UniContract = await ethers.getContractAt("IERC20", UNI);

	// const holderBalance = await DaiContract.balanceOf(DAIHolderImpersonated);
	// console.log(`Dai balance before ${holderBalance}`);

	// await DaiContract.connect(impersonatedSigner).approve(ROUTER, amountToSwap);

	// const uniBalance = await UniContract.balanceOf(DAIHolderImpersonated);
	// console.log(`uniBalance ${uniBalance}`);

	// await Uniswap.connect(impersonatedSigner).swapExactTokensForTokens(
	// 	amountToSwap,
	// 	0,
	// 	paths,
	// 	DAIHolderImpersonated,
	// 	time
	// );

	// const uniBalanceAfter = await UniContract.balanceOf(DAIHolderImpersonated);
	// const holderBalanceAfter = await DaiContract.balanceOf(DAIHolderImpersonated);
	// console.log(
	// 	`uniBalanceAfter ${uniBalanceAfter} Dai balance After ${holderBalanceAfter}`
	// );

	// const sent = ethers.utils.parseEther("0.1");

	// const ETHbalanceBefore = await ethers.provider.getBalance(
	// 	DAIHolderImpersonated
	// );
	// console.log(`ETHBalance before ${ETHbalanceBefore}`);

	// await Uniswap.connect(impersonatedSigner).swapETHForExactTokens(
	// 	amountToReceive,
	// 	path2,
	// 	DAIHolderImpersonated,
	// 	time,
	// 	{
	// 		value: sent,
	// 	}
	// );

	// console.log(
	// 	`sent ${sent} => difference ${Number(ETHbalanceBefore) - Number(sent)}`
	// );

	// const ETHbalanceAfter = await ethers.provider.getBalance(
	// 	DAIHolderImpersonated
	// );
	// const holderBalanceAfterETH = await DaiContract.balanceOf(
	// 	DAIHolderImpersonated
	// );
	// console.log(
	// 	`ETH Balance after ${ETHbalanceAfter} => Dai balance After ETH${holderBalanceAfterETH}`
	// );

	const tokenAddress = "0xC38feE6C192EABaAEAb231a55B91b6AD95DFFa7E"; // insert token address here

	const token = new Token(ChainId.MAINNET, tokenAddress, 18);

	const weth = WETH[ChainId.MAINNET];

	const pair = await Fetcher.fetchPairData(token, weth);

	const route = new Route([pair], weth);

	const trade = new Trade(
		route,
		new TokenAmount(weth, "0"),
		TradeType.EXACT_INPUT
	);

	const slippageTolerance = new Percent("50", "10000"); // 0.5%

	const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;

	const path = [weth.address, tokenAddress];

	const deadline = Math.floor(Date.now() / 1000) + 60 * 120;

	await Uniswap.connect(impersonatedSigner).addLiquidityETH(
		tokenAddress,
		amountToReceive,
		0,
		0,
		'0xed0FEcC393cD5Fc29DCB25A7517B639F2Efbd31E',
		deadline
	);
}

// 150,000 000 000 000 000 000 000
//150 014 568 346 647 994 343 514
// 150 000 000 000 000 000 000 249
// 15,110,085 000 000 000 000 000 000
//15,110 185 000 000 000 000 000 000

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
