import {ethers} from "ethers";
import {wallet} from '../../contracts/contract';
import ssvNetworkV4Abi from '../../contracts/abi/SSVNetworkV4.json';

const ssvNetworkV4Contract = new ethers.Contract("0xC3CD9A0aE89Fff83b71b58b6512D43F8a41f363D", ssvNetworkV4Abi, wallet);

async function registerValidator() {

    const pubkey = "";
    const sharesData = "";
    const operatorIds: number[] = [];
    const amount = 0;
    const cluster: any[] = [];

    const tx = await ssvNetworkV4Contract.registerValidator(pubkey, sharesData, operatorIds, amount, cluster);
    console.log("tx", tx);

    const receipt = await tx.wait();
    const newOperatorId = receipt.events.find((event: any) => event.event === "OperatorAdded");
    console.log("newOperatorId", newOperatorId.args.operatorId.toNumber());
}

registerValidator();