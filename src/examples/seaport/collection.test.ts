import {describe, jest, test} from '@jest/globals'
import {ethers} from 'ethers'
import {wallet} from '../../contracts/contract';

const NFT = [
    "function isApprovedForAll(address owner, address operator) public view returns (bool)",
    "function ownerOf(uint256 tokenId) public view returns (address)",
]

describe("NFT", () => {
    jest.setTimeout(30000);

    const nftContract = new ethers.Contract("0xE24689B848AeF5aa89E47FDdFC78E100BBE6fFe3", NFT, wallet);

    test("isApprovedForAll", async () => {
        const result = await nftContract.isApprovedForAll(
            "0x892e7c8C5E716e17891ABf9395a0de1f2fc84786",
            "0x2D206f3f2d0c97586dcf40c5095BEEe33B34D347"
        );

        console.log(result);
    });

    test("ownerOf", async () => {
        const result = await nftContract.ownerOf(41);

        console.log(result);
    });

});
