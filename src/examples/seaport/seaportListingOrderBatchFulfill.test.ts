import {Seaport} from "@opensea/seaport-js";
import {walletA, walletB} from '../../contracts/contract';
import {ItemType} from '@opensea/seaport-js/lib/constants'
import {ethers} from 'ethers'
import {describe, jest, test} from "@jest/globals";
import type {OrderWithCounter} from '@opensea/seaport-js/lib/types'

// holesky collection 0x591cb9272E1C16bF0A71A90BD14D63C1aE74A4F8 airdropMint 37~41 to 0x892e7c8C5E716e17891ABf9395a0de1f2fc84786
// eg tx: https://holesky.etherscan.io/tx/0x6728121550291a1ef87f0ea38b86f0960e4a8585358ed2b4f41cd4b1b57f93dc
// 每次order在链上履行，需要重新批准授权 setApprovalForAll
describe("Listing batch ERC-721 for ETH and fulfilling them", () => {
    jest.setTimeout(100000);

    console.log("offer account:", walletA.address)
    console.log("fulfill account:", walletB.address)

    const offerer = "0x892e7c8C5E716e17891ABf9395a0de1f2fc84786";
    const fulfiller = "0xe583DC38863aB4b5A94da77A6628e2119eaD4B18";

    let orders: OrderWithCounter[];

    test("Listing an ERC-721 createBulkOrders", async () => {

        const seaport = new Seaport(walletA, {
            overrides: {contractAddress: "0x12246eb75caF4D4FBFcE48741abC5EeDCB1c1B76"}
        });

        const {executeAllActions} = await seaport.createBulkOrders(
            [
                {
                    offer: [
                        {
                            itemType: ItemType.ERC721,
                            token: "0x52bA995dba1BCaA1F0d1E671E92DEa62F289B80A",
                            identifier: "37",
                        }
                    ],
                    consideration: [
                        {
                            amount: ethers.parseEther("1").toString(),
                            recipient: offerer,
                        },
                    ],
                },
                {
                    offer: [
                        {
                            itemType: ItemType.ERC721,
                            token: "0x52bA995dba1BCaA1F0d1E671E92DEa62F289B80A",
                            identifier: "38",
                        }
                    ],
                    consideration: [
                        {
                            amount: ethers.parseEther("2").toString(),
                            recipient: offerer,
                        },
                    ],
                },
            ],
            offerer,
            true,
        );

        orders = await executeAllActions();

        console.log("order:", orders);
    });

    test("Listing ERC-721 fulfillOrders", async () => {
        const seaport = new Seaport(walletB, {
            overrides: {contractAddress: "0x12246eb75caF4D4FBFcE48741abC5EeDCB1c1B76"}
        });

        const {executeAllActions: executeAllFulfillActions} =
            await seaport.fulfillOrders({
                fulfillOrderDetails: [
                    {order: orders[0]},
                    {order: orders[1]},
                ],
                accountAddress: fulfiller,
            });

        const tx = await executeAllFulfillActions();
        console.log("tx:", tx);

        const res = tx as ethers.TransactionResponse;
        console.log("tx res:", res.hash);

    });

});
