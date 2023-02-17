import { ethers } from "hardhat";

// voting token has been deployed to  0xC38feE6C192EABaAEAb231a55B91b6AD95DFFa7E
// voting contract has been deployed to 0xab93933674f3Cc154789bb7aa0C15Cc5EF9d3D46

async function main() {
	const [owner, acct1, acct2] = await ethers.getSigners();
	const voteToken = await ethers.getContractFactory("SureToken");

	const VotingToken = {
		name: "Voting Token",
		symbol: "VT",
		decimal: 2,
		totalSupply: 6_000_000,
	};
	const deployedVoteToken_ = await voteToken.deploy(
		VotingToken.name,
		VotingToken.symbol,
		VotingToken.decimal,
		VotingToken.totalSupply
	);
	await deployedVoteToken_.deployed();
	console.log(await deployedVoteToken_); // logs everything about the contract
	console.log(`voting token deployed to: ${deployedVoteToken_.address}`);

	const vcontract = await ethers.getContractFactory("Vcontract");

	
	const voteInfo = {
		name: "E-vote",
		contenders: ["APC", "PDP", "LP"],
		period: 1000000000,
		tokenPerVote: 6,
		//voteTokenAddrr: `${deployedVoteToken.address}`,
	};
	const evotedeploy = await vcontract.deploy(
		voteInfo.name,
		voteInfo.contenders,
		voteInfo.period,
		voteInfo.tokenPerVote,
		deployedVoteToken_.address
	);
	await evotedeploy.deployed();
	console.log(`voting contract has been deployed to ${evotedeploy.address}`);
}

//voting token has been deployed to  0xDDBD714575b3F7C89b7B02609Bd2853b4bf212F8
//voting contract has been deployed to 0xF0072390ed40f7706058268f7a4ba8f31Ce487df

main().catch((e) => {
	console.log(e);
	process.exitCode = 1;
});

// npx hardhat compile
// npx hardhat run scripts/Factory.ts --network goerli
// npx hardhat verify --network goerli <address> <unlocktime>
// npx hardhat verify --network goerli 0xc50bB6a349c9Cb2d30c36e4C9A105711deD2C57D
// npx hardhat verify --constructor-args arguments.js
// npx hardhat verify --network goerli --constructor-args VContract.ts 0xC38feE6C192EABaAEAb231a55B91b6AD95DFFa7E

// npx hardhat verify --constructor-args EToken.ts --network goerli 0xC38feE6C192EABaAEAb231a55B91b6AD95DFFa7E
// npx hardhat verify --constructor-args VContract.ts --network goerli 0xab93933674f3Cc154789bb7aa0C15Cc5EF9d3D46

//verified token =  https://goerli.etherscan.io/address/0xC38feE6C192EABaAEAb231a55B91b6AD95DFFa7E#code
//verified contract address = https://goerli.etherscan.io/address/0xab93933674f3Cc154789bb7aa0C15Cc5EF9d3D46#code
