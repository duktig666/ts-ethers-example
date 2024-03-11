import {ethers} from "ethers";
import {config} from "../config/config";
import {Signer} from 'ethers'

const executionLayerAddr = config.executionLayerAddr;
const provider = new ethers.providers.JsonRpcProvider(executionLayerAddr);
const privateKey = config.privateKey;
const wallet = new ethers.Wallet(privateKey, provider);
const signer: Signer = wallet as Signer;

export {provider, wallet, signer}
