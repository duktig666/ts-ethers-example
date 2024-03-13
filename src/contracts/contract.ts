import {ethers} from "ethers";
import {config} from "../config/config";

const executionLayerAddr = config.executionLayerAddr;
const provider = new ethers.JsonRpcProvider(executionLayerAddr);
const privateKey = config.privateKey;
const privateKeyA = config.privateKeyA;
const privateKeyB = config.privateKeyB;
const wallet = new ethers.Wallet(privateKey, provider);
const walletA = new ethers.Wallet(privateKeyA, provider);
const walletB = new ethers.Wallet(privateKeyB, provider);

export {provider, wallet, walletA, walletB}
