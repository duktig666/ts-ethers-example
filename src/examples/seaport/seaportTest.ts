import {Seaport} from "@opensea/seaport-js";
import {wallet} from '../../contracts/contract';

// @ts-ignore
const seaport = new Seaport(wallet, {
    overrides: {contractAddress: "0x2D206f3f2d0c97586dcf40c5095BEEe33B34D347"}
});


