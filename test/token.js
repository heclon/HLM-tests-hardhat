import { expect } from "chai";
import pkg from 'hardhat';
const { ethers } = pkg;

describe("HLM Token Contract" , ()=> {

  let Token, hardhatToken, owner, address1, address2;

  beforeEach(async ()=> {
    Token = await ethers.getContractFactory("Token");
    [owner, address1, address2] = await ethers.getSigners();
    hardhatToken = await Token.deploy();
  })

  describe("Deployment", () => {

    it("Should set the right owner", async () => {
      expect(await hardhatToken.owner()).to.equal(owner.address); // should be owner address
    })

    it("Should assign the total supply of tokens to the owner", async () => {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      // console.log("Owner address: ", owner.address);
      expect(Number(await hardhatToken.totalSupply())).to.equal(Number(ownerBalance)); // should be 100000
    })
  })
  
  describe("Transfers", () => {

    it("Should transfer tokens between accounts", async () => {
    
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

    it("Should fail if sender does not have enough tokens", async () => {
      const connectToAddress1 = await hardhatToken.connect(address1);
      await expect(await connectToAddress1.transfer(owner.address, 100)).to.throw //rejectedWith("Not enough tokens");

      // const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
      // await expect(hardhatToken.transfer(address1.address, 7));

      expect(Number(await hardhatToken.balanceOf(owner.address))).to.equal(Number(initialOwnerBalance)); // should be 100000
    })

    it("Should update balances after transfesr", async () => {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
      await hardhatToken.transfer(address1.address, 10);
      await hardhatToken.transfer(address2.address, 20);

      const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
      expect(Number(finalOwnerBalance)).to.equal(initialOwnerBalance - 30);

      const address1Balance = await hardhatToken.balanceOf(address1.address);
      expect(Number(address1Balance)).to.equal(10);

      const address2Balance = await hardhatToken.balanceOf(address2.address);
      expect(Number(address2Balance)).to.equal(20);

    })
  })
})