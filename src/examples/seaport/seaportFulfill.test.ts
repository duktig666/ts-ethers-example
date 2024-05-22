import {Seaport} from "@opensea/seaport-js";
import {walletA, walletB} from '../../contracts/contract';
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
describe("fulfilling it", () => {
    jest.setTimeout(10000000);

    console.log("walletA account:", walletA.address)
    console.log("walletB account:", walletB.address)

    // const offerer = walletA.address;
    const fulfiller = walletB.address;
    const seaportAddress = "0x1eEe23139eea502a2A41d90D1fA0123271Bf4245";

    let order: OrderWithCounter =
        {
            "parameters": {
                "offerer": "0xa38e1014502dB7a532a2163832b04a0A343B65Ce",
                "zone": "0x0000000000000000000000000000000000000000",
                "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
                "startTime": "1715676492",
                "endTime": "1718354892",
                "orderType": 0,
                "offer": [
                    {
                        "itemType": 2,
                        "token": "0xE24689B848AeF5aa89E47FDdFC78E100BBE6fFe3",
                        "identifierOrCriteria": "42",
                        "startAmount": "1",
                        "endAmount": "1"
                    }
                ],
                "consideration": [
                    {
                        "itemType": 0,
                        "token": "0x0000000000000000000000000000000000000000",
                        "identifierOrCriteria": "0",
                        "startAmount": "980000000000000000",
                        "endAmount": "980000000000000000",
                        "recipient": "0xa38e1014502dB7a532a2163832b04a0A343B65Ce"
                    },
                    {
                        "itemType": 0,
                        "token": "0x0000000000000000000000000000000000000000",
                        "identifierOrCriteria": "0",
                        "startAmount": "20000000000000000",
                        "endAmount": "20000000000000000",
                        "recipient": "0xED276762AabC3891D02aB120C34472BDf2BF7595"
                    }
                ],
                "totalOriginalConsiderationItems": 2,
                "salt": "0x00000000000000000000000000000000000000000000000067ee3510896b5958",
                "conduitKey": "0x0000000000000000000000000000000000000000000000000000000000000000",
                "counter": "0"
            },
            "signature": "0xaaca26f8f62276150b75b5c83323feb7a699609246553f0de1f64d20151da3f48e5b6c68b1e8b690df2c9953aa6f7071f619c1cfe31b49a4a09b6a0e5fa4aa42"
        };


    test("fulfillOrder", async () => {
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
