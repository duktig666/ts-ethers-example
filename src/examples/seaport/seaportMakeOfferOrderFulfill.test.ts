import {Seaport} from "@opensea/seaport-js";
import {walletA, walletB} from '../../contracts/contract';
import {ItemType} from '@opensea/seaport-js/lib/constants'
import {ethers} from 'ethers'
import {describe, jest, test} from "@jest/globals";
import type {OrderWithCounter} from '@opensea/seaport-js/lib/types'

// 自定义erc20合约 t20 https://holesky.etherscan.io/address/0x9beb18563f02e19C6E875CcE3Cb0e95bDC211A87 owner 0xe583DC38863aB4b5A94da77A6628e2119eaD4B18
// eg tx: https://holesky.etherscan.io/tx/0x45b414fb3c813918ba8be0cd3e604d37b765d20536b3995398d26b50d7f5d99f
describe("Making an offer for an ERC-721 for t20 and fulfilling it", () => {
    jest.setTimeout(100000);

    console.log("walletA account:", walletA.address)
    console.log("walletB account:", walletB.address)

    const offerer = walletA.address;
    const fulfiller = walletB.address;
    const seaportAddress = "0x1eEe23139eea502a2A41d90D1fA0123271Bf4245";

    let order: OrderWithCounter;

    test("Making an offer createOrder", async () => {

        const seaport = new Seaport(walletA, {
            overrides: {contractAddress: seaportAddress}
        });

        const {executeAllActions} = await seaport.createOrder(
            {
                offer: [
                    {
                        amount: ethers.parseEther("1").toString(),
                        // t20
                        token: "0x9beb18563f02e19C6E875CcE3Cb0e95bDC211A87",
                    },
                ],
                consideration: [
                    {
                        itemType: ItemType.ERC721,
                        token: "0x5678566d017EA80205c877E8343F82E31411a2Fb",
                        identifier: "32",
                        recipient: offerer,
                    },
                ],
                fees: [{recipient: "0x00dFaaE92ed72A05bC61262aA164f38B5626e106", basisPoints: 250}],

            },
            offerer,
        );

        order = await executeAllActions();

        console.log("order:", JSON.stringify(order));
    });

    test("Making an offer fulfillOrder", async () => {
        const seaport = new Seaport(walletB, {
            overrides: {contractAddress: seaportAddress}
        });

        const {executeAllActions: executeAllFulfillActions} =
            await seaport.fulfillOrder({
                order,
                accountAddress: fulfiller,
                overrides: {
                    gasLimit: 1_000_000
                },
            });

        const tx = await executeAllFulfillActions();
        console.log("tx:", tx);

        const res = tx as ethers.TransactionResponse;
        console.log("tx res:", res.hash);

    });

});


