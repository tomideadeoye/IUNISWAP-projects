import { ethers } from "hardhat";

// const admin1 = 0x6027e73b461ad3a996ef3fc999845cae1e359028;
// const admin2 = 0xed0fecc393cd5fc29dcb25a7517b639f2efbd31e;

const dummyAccounts = [
	"0x5935D05E52e2543d26CbF19b941092680E99A99E",
	"0x467D12562C926961e451781e15603F22D05a41A5",
	"0x39afCfc8B6c71c0344Ba2C91d0EE6593fFB19E4C",
];

async function main() {
	const [owner, admin1] = await ethers.getSigners();
	const admins = [owner.address, admin1.address, dummyAccounts[2]];
	// const CloneMultiSig = await ethers.getContractFactory("cloneMultiSig");
	// const cloneMultiSig = await CloneMultiSig.deploy();
	// await cloneMultiSig.deployed();
	// console.log(`Multisig Address is ${cloneMultiSig.address}`);
	// const newMultisig = await cloneMultiSig.createMultiSig(admins);
	// let event = await newMultisig.wait();
	// let newChild = event.events[0].args[0];
	// console.log(newChild);

	const childMultisig = await ethers.getContractAt(
		"IMultisig",
		"0x0B240415d40501b061E9296B9A71d24120D305Cc"
	);
	// const addresses = await childMultisig.returnAdmins();
	// console.log(addresses);
	// await childMultisig.addAdmin(dummyAccounts[0]);
	// await childMultisig.connect(admin1).addAdmin(dummyAccounts[0]);

	const addressesNew = await childMultisig.returnAdmins();
	console.log(addressesNew);
}

// We recommend this pattern to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

// npx hardhat run scripts/Factory.ts --network goerli
// npx hardhat verify --network goerli <address> <unlocktime>
// npx hardhat verify --network goerli 0xc50bB6a349c9Cb2d30c36e4C9A105711deD2C57D
// npx hardhat verify --constructor-args arguments.js
// npx hardhat verify --network goerli --constructor-args arguments.ts 0x0B240415d40501b061E9296B9A71d24120D305Cc