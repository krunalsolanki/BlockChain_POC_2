let CrowdFundingWithDeadline = artifacts.require('./TestCrowdFundingWithDeadline')
const BigNumber = require('bignumber.js')
 
contract('CrowdFundingWithDeadline', function(accounts) {

    let contract;
    let contractCreator = accounts[2];
    let contractCreator2 = accounts[3];
    let contractCreator3 = accounts[4];
    let beneficiary = accounts[5];
    let contractDeployer = accounts[1];

    const TEN_ETH = new BigNumber(10000000000000000000);
    const NINE_ETH = new BigNumber(9000000000000000000);
    const ONE_ETH = new BigNumber(1000000000000000000);
    const TWENTY_ETH = new BigNumber(20000000000000000000);

    const ERROR_MSG = 'Returned error: VM Exception while processing transaction: revert';
    const ONGOING_STATE = 0;
    const FAILED_STATE = 1;
    const SUCCEEDED_STATE = 2;
    const PAID_OUT_STATE = 3;

  
    beforeEach(async function() {
        contract = await CrowdFundingWithDeadline.new('funding', 20, 10, beneficiary, {from: contractDeployer, gas: 2000000});
    // console.error( contract.receipt.gasUsed);
    });
/*
    it('contract is initialized', async function() {
        let contractName = await contract.name.call()
        expect(contractName).to.equal('funding');

        let targetAmount = await contract.targetAmount.call()
        expect(TWENTY_ETH.isEqualTo(targetAmount)).to.equal(true);

        let fundingDeadline = await contract.fundingDeadline.call()
        expect(fundingDeadline.toNumber()).to.equal(600);

        let actualBeneficiary = await contract.beneficiary.call()
        expect(actualBeneficiary).to.equal(beneficiary);

        let state = await contract.state.call()
        expect(state.valueOf().toNumber()).to.equal(ONGOING_STATE);

    });
    */

    it('funds are contributed Party 1, 2, 3 and paid to beneficiary', async function() {
      
        let state = await contract.state.call();
        expect(state.valueOf().toNumber()).to.equal(ONGOING_STATE);
         var cnt =   await contract.contribute({value: ONE_ETH, from: contractCreator});
         await contract.contribute({value: NINE_ETH, from: contractCreator2});
         await contract.contribute({value: TEN_ETH, from: contractCreator3});
         state = await contract.state.call();
         expect(state.valueOf().toNumber()).to.equal(ONGOING_STATE);
        let totalCollected = await contract.totalCollected.call();
        expect(TWENTY_ETH.isEqualTo(totalCollected)).to.equal(true);
        state = await contract.state.call();
        expect(state.valueOf().toNumber()).to.equal(ONGOING_STATE);
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();
        state = await contract.state.call();
        expect(state.valueOf().toNumber()).to.equal(SUCCEEDED_STATE);
        await contract.collect();
        state = await contract.state.call();
        expect(state.valueOf().toNumber()).to.equal(PAID_OUT_STATE);
       

    });
   /*
    it('funds are contributed Party 1, 2 and failed ', async function() {
      
        var cnt =   await contract.contribute({value: ONE_ETH, from: contractCreator});
        await contract.contribute({value: NINE_ETH, from: contractCreator2});
    
      
       await contract.setCurrentTime(601);
       await contract.finishCrowdFunding();
       let state = await contract.state.call();
        expect(state.valueOf().toNumber()).to.equal(FAILED_STATE);
        await contract.withdraw({from: contractCreator});
        await contract.withdraw({from: contractCreator2});

   });*/
  


/*

    it('funds are contributed', async function() {
      
        // Get Estimate gas for contract - Contribute
        var sct = await  contract.contribute.estimateGas({value: ONE_ETH, from: contractCreator});
        console.error('Total Gas for contribute method'+ sct);
       
        // Get latest GasPrice
        var gasPrice = ( await  web3.eth.getGasPrice() );
        console.error("Gas Price is " + gasPrice + " wei");

        // Gas * GasPrice
         console.error("gas cost estimation = " + (sct * gasPrice) + " wei");
         // Tranfer into Ether
         var gce = web3.utils.fromWei((sct * gasPrice).toString(), 'ether');
         console.error("gas cost estimation = " + gce + " ether");
        // Find out Total cost (Transfer Amount + Gas Amount)
         var gce = web3.utils.fromWei((ONE_ETH.toNumber()+(sct * gasPrice)).toString(), 'ether');
         console.error("Total cost and Amount estimation = " + gce + " ether");
   
          
        // Balance for Contract  in wei        
        var balance =  await web3.eth.getBalance(contractCreator); 
        // Convert to Ether
        console.error("Balance " + await web3.utils.fromWei(balance.toString(), 'ether'));
         var cnt =   await contract.contribute({value: ONE_ETH, from: contractCreator});

           

        let contributed = await contract.amounts.call(contractCreator);
        expect(ONE_ETH.isEqualTo(contributed)).to.equal(true);

        let totalCollected = await contract.totalCollected.call();

        expect(ONE_ETH.isEqualTo(totalCollected)).to.equal(true);

      //  console.log(       contract.totalCollected.estimateGas());
    });

    it('cannot contribute after deadline', async function() {
        try {

     
            await contract.setCurrentTime(601);
// 
//         let a = await  contract.sendTransaction.estimateGas(ONE_ETH, {from: contractCreator});
//           
// 
//         let ed =   await  contract.sendTransaction.estimateGas(ONE_ETH, {from: web3.eth.accounts[0]});
//         console.log(ed);

//           let ep =  await contract.method.estimateGas(
//             {
//                 value: ONE_ETH,
//                 from: contractCreator
//             });
//             console.log(ep); 

            await contract.sendTransaction({
                value: ONE_ETH,
                from: contractCreator
            });
            expect.fail();
         
          console.log(a);
        } catch (error) {
            expect(error.message).to.equal(ERROR_MSG);
        }
    })

    it('crowdfunding succeeded', async function() {
        
        var sct = await  contract.setCurrentTime.estimateGas(601);
        console.error('Total Gas setCurrentTime '+ sct);
        sct = await  contract.contribute.estimateGas({value: ONE_ETH, from: contractCreator});
        console.error('Total Gas contribute '+ sct);

        await contract.contribute({value: ONE_ETH, from: contractCreator});
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();
        let state = await contract.state.call();

        expect(state.valueOf().toNumber()).to.equal(SUCCEEDED_STATE);

        
        
    });

    it('crowdfunding failed', async function() {
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();
        let state = await contract.state.call();

        expect(state.valueOf().toNumber()).to.equal(FAILED_STATE);
    });

    it('collected money paid out', async function() {
        await contract.contribute({value: ONE_ETH, from: contractCreator});
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();

        let initAmount = await web3.eth.getBalance(beneficiary);
        await contract.collect({from: contractCreator});

        let newBalance = await web3.eth.getBalance(beneficiary);
        let difference = newBalance - initAmount;
        expect(ONE_ETH.isEqualTo(difference)).to.equal(true);

        let fundingState = await contract.state.call()
        expect(fundingState.valueOf().toNumber()).to.equal(PAID_OUT_STATE);
    });

    it('withdraw funds from the contract', async function() {
        await contract.contribute({value: ONE_ETH - 100, from: contractCreator});
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();

        await contract.withdraw({from: contractCreator});
        let amount = await contract.amounts.call(contractCreator);
        expect(amount.toNumber()).to.equal(0);
    });

    it('event is emitted', async function() {
        await contract.setCurrentTime(601);
        const transaction = await contract.finishCrowdFunding();

        const events = transaction.logs
        expect(events.length).to.equal(1);

        const event = events[0]
        expect(event.args.totalCollected.toNumber()).to.equal(0);
        expect(event.args.succeeded).to.equal(false);
    });
   */

});
 
