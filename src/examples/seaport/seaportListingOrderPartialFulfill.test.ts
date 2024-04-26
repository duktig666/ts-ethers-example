import {Seaport} from "@opensea/seaport-js";
import {walletA, walletB} from '../../contracts/contract';
import {ItemType} from '@opensea/seaport-js/lib/constants'
import {ethers} from 'ethers'
import {describe, jest, test} from "@jest/globals";
import type {OrderWithCounter} from '@opensea/seaport-js/lib/types'

// 1155 完全成交 https://holesky.etherscan.io/tx/0x21a33ad7e79d2a3074e72a578e1ee38edb07edb1ec1a0a500be2ede3921d3d78
// 1155 部分成交 https://holesky.etherscan.io/tx/0x472c1e6ca0b08d6d1c8692542a9111c20ff10daa11a04b2d3ec7d44f0683206d
describe("Listing an ERC-1155 for ETH and fulfilling it", () => {
    jest.setTimeout(10000000);

    console.log("walletA account:", walletA.address)
    console.log("walletB account:", walletB.address)

    const offerer = walletA.address;
    const fulfiller = walletB.address;
    const seaportAddress = "0x1eEe23139eea502a2A41d90D1fA0123271Bf4245";

    let order: OrderWithCounter;

    test("Listing an ERC-1155 createOrder", async () => {

        const seaport = new Seaport(walletA, {
            overrides: {contractAddress: seaportAddress}
        });

        const {executeAllActions} = await seaport.createOrder(
            {
                offer: [
                    {
                        itemType: ItemType.ERC1155,
                        token: "0xe469b8C8bC6FaD72CbaFE558787Dcc43E3FA705A",
                        identifier: "1",
                        amount: '5',
                    },
                ],
                consideration: [
                    {
                        amount: ethers.parseEther("1").toString(),
                        recipient: offerer,
                    },
                ],
                allowPartialFills: true,
            },
            offerer,
            false,
        );

        order = await executeAllActions();

        console.log("order:", JSON.stringify(order));
    });

    test("Listing an ERC-1155 fulfillOrder", async () => {
        const seaport = new Seaport(walletB, {
            overrides: {contractAddress: seaportAddress}
        });


        // console.log(JSON.stringify(order))
        // console.log(order.parameters.offer[0])
        // order.parameters.offer[0].startAmount = '3';

        const {executeAllActions: executeAllFulfillActions} =
            await seaport.fulfillOrder({
                order,
                // unitsToFill: 3,
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
