import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./Arena.css";
import "./Toast.css";
import { CONTRACT_ADDRESS, transformCharacterData } from "../utils/constants";
import myEpicGame from "../contracts/MyEpicGame.json";
import { LoadingIndicator } from "./LoadingIndicator";

const Arena = ({ characterNFT, setCharacterNFT }) => {
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [mpCharacters, setMpCharacters] = useState(null);

  // UseEffects
  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log("Boss:", bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };

    const fetchMultiplayerCharacters = async () => {
      const charactersTxn = await gameContract.getAllPlayers();
      console.log("Allplayers:", charactersTxn);
      setMpCharacters(
        charactersTxn.map((char) => transformCharacterData(char))
      );
    };

    const onAttackComplete = (newBossHp, newPlayerHp) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();

      console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

      setBoss((prevState) => {
        return { ...prevState, hp: bossHp };
      });

      setCharacterNFT((prevState) => {
        return { ...prevState, hp: playerHp };
      });
    };

    if (gameContract) {
      fetchBoss();
      fetchMultiplayerCharacters();
      gameContract.on("AttackComplete", onAttackComplete);
    }

    return () => {
      if (gameContract) {
        gameContract.off("AttackComplete", onAttackComplete);
      }
    };
  }, [gameContract]);

  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  const [attackState, setAttackState] = useState<"IDLE" | "ATTACKING" | "HIT">(
    "IDLE"
  );

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState("ATTACKING");
        console.log("Attacking boss...");
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        setAttackState("HIT");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error attacking boss:", error);
      setAttackState("IDLE");
    }
  };

  return (
    <div className="arena-container">
      {boss && characterNFT && (
        <div id="toast" className={showToast ? "show" : ""}>
          <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
        </div>
      )}
      {/* Replace your Boss UI with this */}
      {boss && (
        <div className="boss-container">
          <div className={`boss-content ${attackState}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
              <img
                src={`https://cloudflare-ipfs.com/ipfs/${boss.imageURI}`}
                alt={`Boss ${boss.name}`}
              />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
              {`💥 Attack ${boss.name}`}
            </button>
          </div>
          {attackState === "ATTACKING" && (
            <div className="loading-indicator">
              <LoadingIndicator />
              <p>Attacking ⚔️</p>
            </div>
          )}
        </div>
      )}
      {/* Replace your Character UI with this */}
      {characterNFT && (
        <div className="players-container">
          <div className="player-container">
            <h2>Your Character</h2>
            <div className="player">
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <img
                  src={`https://cloudflare-ipfs.com/ipfs/${characterNFT.imageURI}`}
                  alt={`Boss ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
      <h2>Other Characters</h2>
      <div className="multiplayer-container">
        {mpCharacters &&
          mpCharacters.map((characterNFT) =>
            characterNFT.name !== "" ? (
              <img
                src={`https://cloudflare-ipfs.com/ipfs/${characterNFT.imageURI}`}
                alt={`Boss ${characterNFT.name}`}
              />
            ) : null
          )}
      </div>
    </div>
  );
};

export default Arena;
