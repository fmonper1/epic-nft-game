import { ethers } from "hardhat";

const main = async () => {
  const gameContractFactory = await ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    [
      "Un Picoleto",
      "Agencia Tributaria",
      "Snoop Dogg",
      "Mia Khalifa",
      "Echenique",
      "Eren",
      "Shaq",
    ], // Names
    [
      "Qmdu5X4fUs93tzNcd8LKB4tGrAyQZ4NDbuAcCEsCVsUaRM", // Images
      "QmRgBkChtWw5QySUZvS8TCyixtjYKrbaifoymoQs1MnMFv",
      "QmQvhaY3HyyezPrA6f64euZfLSUQMbFPDYeQUgZsGhMdd8",
      "QmVLFVPWMPVBntMueK16o9TB5N31pb4aZT93FMCj1WUhqj",
      "Qmf9jNHxGf6KNbHVJEDqCiSfDY64tezdf1XFKzH1jss5EG",
      "Qme9bAxEWGCXPGU11MFPe4ktP6DmbMeSBMme4vHcQXbdGk",
      "QmdF3ki53sbra8q7SDgmBh41HTg73rfMyP8g6iiPu3aBax",
    ],
    [100, 200, 50, 300, 25, 200, 400], // HP values
    [75, 100, 150, 25, 100, 150, 250], // Attack damage values
    "Santi Chorizo - Arbistar 2.0 SL", // Boss name
    "QmaTy1cSvf7qbtno7yB7BKTmFakhY4eVXBpYaribkqgEB4", // Boss image
    5000, // Boss hp
    50 // Boss attack damage
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
