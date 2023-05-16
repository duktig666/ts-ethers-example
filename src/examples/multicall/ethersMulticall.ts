import {ethers} from 'ethers';
import liqAbi from '../../contracts/abi/liquidStaking.json';
import mulAbi from '../../contracts/abi/multicall.json';
import {wallet} from '../../contracts/contract';

const liqGoerliAddress = "0x949AC43bb71F8710B0F1193880b338f0323DeB1a"
const mulGoerliAddress = "0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e"

async function multicall() {

    const liqContract = new ethers.Contract(liqGoerliAddress, liqAbi, wallet);
    let stakeETHData = liqContract.stakeETH(1, {value: ethers.utils.parseEther("1")}).encode();
    let unstakeETHData = liqContract.unstakeETH(1, ethers.utils.parseEther("1")).encode();

    const mulContract = new ethers.Contract(mulGoerliAddress, mulAbi, wallet);
    // var abiCoder = ethers.utils.defaultAbiCoder;
    // var data = abiCoder.encode(liqContract.stakeETH.inputs, values);
    // ethers.utils.defaultAbiCoder.encode()
    //
    // new ethers.utils.Interface()

    // 构建调用参数
    const calls = [
        {
            target: liqGoerliAddress,
            callData: stakeETHData,
        },
        // 添加更多的调用项，如果需要的话
        {
            target: liqGoerliAddress,
            callData: unstakeETHData,
        },
    ];

    // 发送调用交易
    const tx = await mulContract.aggregate(calls);

    // 等待交易被打包和确认
    await tx.wait();

    // 获取交易结果
    const blockNumber = await tx.blockNumber;
    const returnData = await tx.returnData;

    console.log('Block number:', blockNumber);
    console.log('Return data:', returnData);
}

multicall()