import {Seaport} from "@opensea/seaport-js";
import {walletA, walletB} from '../../contracts/contract';
import {ItemType} from '@opensea/seaport-js/lib/constants'
import {ethers} from 'ethers'
import {describe, jest, test} from "@jest/globals";
import type {OrderWithCounter} from '@opensea/seaport-js/lib/types'

// seaport1.5
// holesky collection 0x591cb9272E1C16bF0A71A90BD14D63C1aE74A4F8 airdropMint 32~36 to 0x892e7c8C5E716e17891ABf9395a0de1f2fc84786
// eg tx: https://holesky.etherscan.io/tx/0x6728121550291a1ef87f0ea38b86f0960e4a8585358ed2b4f41cd4b1b57f93dc
// 每次order在链上履行，需要重新批准授权 setApprovalForAll
// ---------------------------------------------------
// seaport1.6
// holesky collection 0x591cb9272E1C16bF0A71A90BD14D63C1aE74A4F8 airdropMint 42~51 to 0x892e7c8C5E716e17891ABf9395a0de1f2fc84786  52~61 0xe583DC38863aB4b5A94da77A6628e2119eaD4B18
//
describe("Listing an ERC-721 for ETH and fulfilling it", () => {
    jest.setTimeout(10000000);

    console.log("walletA account:", walletA.address)
    console.log("walletB account:", walletB.address)

    const offerer = walletA.address;
    const fulfiller = walletB.address;
    const seaportAddress = "0x1eEe23139eea502a2A41d90D1fA0123271Bf4245";

    let order: OrderWithCounter;

    test("Listing an ERC-721 createOrder", async () => {

        const seaport = new Seaport(walletA, {
            overrides: {contractAddress: seaportAddress}
        });

        const {executeAllActions} = await seaport.createOrder(
            {
                offer: [
                    {
                        itemType: ItemType.ERC721,
                        token: "0xD0C68F16C54915809dadd924a6c446Fb1c110aeA",
                        identifier: "33",
                    },
                ],
                consideration: [
                    {
                        amount: ethers.parseEther("2").toString(),
                        recipient: offerer,
                    },
                    {
                        amount: ethers.parseEther("0.02").toString(),
                        recipient: "0x00dFaaE92ed72A05bC61262aA164f38B5626e106",
                    },
                ],
            },
            offerer,
        );

        order = await executeAllActions();

        console.log("order:", order);
    });

    test("Listing an ERC-721 fulfillOrder", async () => {
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
