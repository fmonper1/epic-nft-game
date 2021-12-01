import React, { useEffect, useState } from "react";
import "./App.css";
import { useWallet } from "./hooks/useWallet";
import SelectCharacter from "./components/SelectCharacter";
import MyEpicGame from "./contracts/MyEpicGame.json";
import { ethers } from "ethers";
import { useGame } from "./hooks/useGame";
import Arena from "./components/Arena";
import { LoadingIndicator } from "./components/LoadingIndicator";

declare global {
  interface Window {
    ethereum: any;
  }
}

// Constants
const TWITTER_HANDLE = "foferlio";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

function App() {
  const { currentAccount, checkIfWalletIsConnected, connectWalletAction } =
    useWallet();
  const { characterNFT, setCharacterNFT, fetchNFTMetadata } =
    useGame(currentAccount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected().then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    /*
     * We only want to run this, if we have a connected wallet
     */
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetadata().then(() => {
        setIsLoading(false);
      });
    }
  }, [currentAccount]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src={`https://cloudflare-ipfs.com/ipfs/${"QmaTy1cSvf7qbtno7yB7BKTmFakhY4eVXBpYaribkqgEB4"}`}
            alt={`Boss puto chorizo`}
          />

          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
      /*
       * If there is a connected wallet and characterNFT, it's time to battle!
       */
    } else if (currentAccount && characterNFT) {
      return (
        <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
      );
    }
  };
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Arbistar Slayer ⚔️</p>
          <p className="sub-text">Team up to defeat this fucking scammer!</p>

          {renderContent()}
        </div>
        <div className="footer-container">
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

export default App;
