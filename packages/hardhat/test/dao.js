const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenGatedDao", function () {
  it("Should return the new proposal once it's changed", async function () {
    const TokenGatedDao = await ethers.getContractFactory("TokenGatedDao");
    const tokenGatedDao = await TokenGatedDao.deploy("Hello, world!");
    await tokenGatedDao.deployed();

    expect(await tokenGatedDao.getAllProposals()).to.equal([]);

    const proposal = await tokenGatedDao.createProposal("Hola, mundo!");

    // wait until the transaction is mined
    await proposal.wait();

    expect(await tokenGatedDao.getAllProposals()).to.equal(["Hola, mundo!"]);
  });
});
