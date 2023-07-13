import {ethers} from "ethers";
import {wallet} from '../../contracts/contract';
import ssvNetworkV3Abi from '../../contracts/abi/ssvNetworkV3.json';

const ssvNetworkV3Contract = new ethers.Contract("0xAfdb141Dd99b5a101065f40e3D7636262dce65b3", ssvNetworkV3Abi, wallet);

const operatorPK = "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdmZ0RVlJazY5ZEl5MW0xQjYxbk0KN0FVOGx1NUlhRjFrVktWTDBEMnRvUGNsbXRyeEdtaTN4STVUa3hjZmZBVUFUejdBMmYwaFgrQmMyRDQzYm1KZQpaRFBRSk45OGhURTl4UVVHa0V0L2p0WTRDZzIxZGhBNFNYemQ0Zk9BbXRuYWsxVUh6RDNlY0xDWUtldzNWcGNKCmlpRFpQNXIvVXpTcW4vbWI0VmMxcFpQM05ZK1h3OWtpVFBTakl1aFR1V2orVUlWYWpnWGZLdHFUa0RzWFM1YW8KcEtuMVpTMFQ1ck1qbExDTFREeFpNN2IwQkZTMnB3ZGg5cklBM3psdnFqK0xwRU8zbmY4TUhydDJWVnRXNWUxNwpCTkt2aGg4V05BYVZKdGd2aCtJd05jaEVwMGFRY2cwUE85MUFwM25WaE83ekY5Y0xuR1hkQzV3RmFCRVREOU1YCmJRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K"

export function decodeKey(key?: string) {
    if (!key) return '';
    const abiCoder = new ethers.utils.AbiCoder();
    return abiCoder.decode(['string'], key);
}

export function encodeKey(key?: string) {
    if (!key) return '';
    const abiCoder = new ethers.utils.AbiCoder();
    return abiCoder.encode(['string'], [key]);
}

async function registerOperator() {
    let pkDecode = encodeKey(operatorPK);
    console.log(pkDecode);

    const tx = await ssvNetworkV3Contract.registerOperator(pkDecode, 382640000000);
    console.log("tx", tx);

    const receipt = await tx.wait();
    const newOperatorId = receipt.events.find((event: any) => event.event === "OperatorAdded");
    console.log("newOperatorId", newOperatorId.args.operatorId.toNumber());
}

registerOperator();