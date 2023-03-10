const hre = require("hardhat");
// https://github.com/dadsec-dev/nft---uniswap-forking
async function main() {
	const UniqueToken = await hre.ethers.getContractFactory("UniqueToken");
	const uniqueTokenDeployed = await UniqueToken.deploy(
		"TomideIsAwesome",
		"TIA"
	);
	await uniqueTokenDeployed.deployed();
	console.log("TomideIsAwesome was deployed to:", uniqueTokenDeployed.address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
