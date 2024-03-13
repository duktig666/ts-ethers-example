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

    console.log("offer account:", walletA.address)
    console.log("fulfill account:", walletB.address)

    const offerer = "0x892e7c8C5E716e17891ABf9395a0de1f2fc84786";
    const fulfiller = "0xe583DC38863aB4b5A94da77A6628e2119eaD4B18";

    let order: OrderWithCounter;

    test("Making an offer createOrder", async () => {

        const seaport = new Seaport(walletB, {
            overrides: {contractAddress: "0x12246eb75caF4D4FBFcE48741abC5EeDCB1c1B76"}
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
                        token: "0x52bA995dba1BCaA1F0d1E671E92DEa62F289B80A",
                        identifier: "40",
                        recipient: offerer,
                    },
                ],
            },
            offerer,
            false,
        );

        order = await executeAllActions();

        console.log("order:", order);
    });

    test("Making an offer fulfillOrder", async () => {
        const seaport = new Seaport(walletA, {
            overrides: {contractAddress: "0x12246eb75caF4D4FBFcE48741abC5EeDCB1c1B76"}
        });

        const {executeAllActions: executeAllFulfillActions} =
            await seaport.fulfillOrder({
                order,
                accountAddress: fulfiller,
                exactApproval: false,
            });

        const tx = await executeAllFulfillActions();
        console.log("tx:", tx);

        const res = tx as ethers.TransactionResponse;
        console.log("tx res:", res.hash);

    });

});


