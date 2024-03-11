import {ethers} from "ethers";

async function getBlockTransactions(blockNumber: number) {
    // 连接以太坊节点
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/optimism");

    if (blockNumber == 0) {
        blockNumber = await provider.getBlockNumber();
    }

    console.log("blockNumber：", blockNumber);


    // 获取指定区块
    const block = await provider.getBlock(blockNumber);

    // 遍历区块中的交易
    for (const transactionHash of block.transactions) {
        const transaction = await provider.getTransaction(transactionHash);
        console.log("交易哈希：", transaction.hash);
        console.log("发送者地址：", transaction.from);
        console.log("接收者地址：", transaction.to);
        console.log("交易金额：", ethers.utils.formatEther(transaction.value));
        console.log("------------------------------");
    }
}

// 指定区块号码来获取交易
const blockNumber = 0;
getBlockTransactions(blockNumber);
