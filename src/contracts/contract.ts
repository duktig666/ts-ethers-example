
import {ethers} from "ethers";
import {config} from "../config/config";

const executionLayerAddr = config.executionLayerAddr;
const provider = new ethers.providers.JsonRpcProvider(executionLayerAddr);
const privateKey = config.privateKey;
const wallet = new ethers.Wallet(privateKey, provider);

export {provider,wallet}