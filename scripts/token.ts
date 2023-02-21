require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

async function main() {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}

	const Artwork = await hre.ethers.getContractFactory("Artwork");
	const artwork = await Artwork.deploy("Artwork Contract", "ART");

	await artwork.deployed();

	await hre.run("verify:verify", {
		address: artwork.address,
		constructorArguments: ["Artwork Contract", "ART"],
	});
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
