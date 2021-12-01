import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../utils/constants";
import myEpicGame from "../contracts/MyEpicGame.json";
import { useState } from "react";

export function useGame(currentAccount: string | null) {
  const [characterNFT, setCharacterNFT] = useState<null | any>(null);

  const fetchNFTMetadata = async () => {
    console.log("Checking for Character NFT on address:", currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    const txn = await gameContract.checkIfUserHasNFT();
    if (txn.name) {
      console.log("User has character NFT");
      console.log(transformCharacterData(txn));
      console.log({ setCharacterNFT });
      setCharacterNFT(transformCharacterData(txn));
    } else {
      console.log("No character NFT found");
    }
  };

  return { characterNFT, setCharacterNFT, fetchNFTMetadata };
}
