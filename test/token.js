import { expect } from "chai";
import pkg from 'hardhat';
const { ethers } = pkg;

describe("Token Contract" , ()=> {
  it("Deployment should assign the total supply of tokens to the owner", async () => {
    
    const[owner] = await ethers.getSigners();
    console.log("signers object: ", owner);

    const token = await ethers.getContractFactory("Token");
    const hardhatToken = await token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    console.log("Owner address: ", owner.address);

    expect(Number(await hardhatToken.totalSupply())).to.equal(Number(ownerBalance)); // should be 100000
  })

  it("Should transfer tokens between accounts", async () => {
    const[address1, address2] = await ethers.getSigners();
    const token = await ethers.getContractFactory("Token");
    const hardhatToken = await token.deploy();
    
    //Transfer the token from owner to address1
    await hardhatToken.transfer(address1.address, 50);

    //Expect the 50 tokens are now in address1
    expect(Number(await hardhatToken.balanceOf(address1.address))).to.equal(50);

    //Transfer 25 token from address1 to address2
    await hardhatToken.connect(address1).transfer(address2.address, 25);

    //Expect the 25 tokens are now in address2
    expect(Number(await hardhatToken.balanceOf(address2.address))).to.equal(25);

    //And that address1 has now a balance of 25
    expect(Number(await hardhatToken.balanceOf(address1.address))).to.equal(25);    
  })
})