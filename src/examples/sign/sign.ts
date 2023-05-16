import {wallet} from '../../contracts/contract';
import {ethers} from "ethers";

const message = 'DUKTIG666';

async function sign() {
    const signature = await wallet.signMessage(message)

    const signatureBytes = ethers.utils.arrayify(signature);

    console.log("message:",message)
    console.log("signature:",signature)
    console.log("signatureBytes:",signatureBytes)
}

sign()