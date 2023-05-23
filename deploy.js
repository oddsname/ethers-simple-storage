const ethers = require('ethers');
const fs = require('fs-extra');
const dotenv = require('dotenv')

dotenv.config();

async function main() {
    const address = process.env.CHAIN_URL
    const privateKey = process.env.PRIVATE_KEY;

    const provider = new ethers.JsonRpcProvider(address);
    const wallet = new ethers.Wallet(
        privateKey,
        provider
    );
    //compiled contract files
    const abi = JSON.parse(fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf8'));
    const binary = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.bin', 'utf8');
    //

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying please wait...");
    // u can specify some parameters like gasLimit, gasPrice etc. inside deploy function
    const contract = await contractFactory.deploy();
    console.log("Contract deployed! 🥂🥂");

    //wait until some number of blocks confirmations
    const transactionReceipt = await contract.deploymentTransaction().wait(1);

    //call `get` function of smart contract
    const tsat = (await contract.get()).toString();
    console.log("number before: " + tsat);
    //random num from 0 to 10
    const randNum =  Math.floor(Math.random() * 11);

    //call `store` function of smart contract
    const txResponse = await contract.store(randNum);
    const txReceipt = await txResponse.wait(1);

    //call `get` function of smart contract
    const updatedNum = await contract.get();
    console.log("update num: " + updatedNum.toString());
}

main()
    .then(() => process.exit())
    .catch((err) => console.log(err))

//------VERSION 1---- send transaction to deploy smart contract
// const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
// console.log("Deploying please wait...");
// // u can specify some parameters like gasLimit, gasPrice etc. inside deploy function
// // inside contract variable we have all functionality described in the abi
// const contract = await contractFactory.deploy();
// console.log("Contract deployed! 🥂🥂");
//
// //wait until some number of blocks confirmations
// const transactionReceipt = await contract.deploymentTransaction().wait(1);
// console.log(transactionReceipt);

//transaction response just when u create transaction
// console.log(contract.deploymentTransaction);
//u only get transaction receipt when u wait for block confirmation
// console.log(transactionReceipt);
//-------VERSION 1-------END


//------VERSION 2---- send transaction to deploy smart contract
// const nonce = await wallet.getNonce();
//
// const tx =  {
//     nonce,
//     gasPrice: 20000000000,
//     gasLimit: 1000000,
//     to: null,
//     value: 0,
//     //data = '0x' + SimpleStorage_sol_SimpleStorage.bin file content
//     data: "0x608060405234801561001057600080fd5b5061017f806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80636057361d146100465780636d4ce63c14610062578063c7a0d9f614610080575b600080fd5b610060600480360381019061005b91906100cc565b61009e565b005b61006a6100a8565b6040516100779190610108565b60405180910390f35b6100886100b1565b6040516100959190610108565b60405180910390f35b8060008190555050565b60008054905090565b60005481565b6000813590506100c681610132565b92915050565b6000602082840312156100e2576100e161012d565b5b60006100f0848285016100b7565b91505092915050565b61010281610123565b82525050565b600060208201905061011d60008301846100f9565b92915050565b6000819050919050565b600080fd5b61013b81610123565b811461014657600080fd5b5056fea2646970667358221220d78cd2f6b65fca8d26528e42e9f6001924abb9022a7ae7d4a1b55e2954258acf64736f6c63430008070033",
//     chainId: 1337,
// };
//
// //you can sign data using await wallet.signTransaction(tx);
// const sentTxResponse = await wallet.sendTransaction(tx);
// await sentTxResponse.wait(1);
// console.log(sentTxResponse);
//-----VERSION 2------ end