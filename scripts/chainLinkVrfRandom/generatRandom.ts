import { ethers } from "hardhat";

async function main() {
	const [owner, admin1] = await ethers.getSigners();
	console.log(owner.address, await (await owner.getBalance()).toString());

	const randomNumGen = await ethers.getContractFactory("VRFv2Consumer");
	const randomNumGen_ = await randomNumGen.deploy(10129);
	await randomNumGen_.deployed();

	console.log(`random number generator deployed to: ${randomNumGen_.address}`);

	const tx = await randomNumGen_.requestRandomWords();

	randomNumGen_.lastRequestId().then((id) => {
		console.log(id.toString());
	});

	// const id = await randomNumGen_.lastRequestId;
	// console.log(id.toString());
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
