const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenGatedDao", function () {
  it("Should return the new proposal once it's changed", async function () {
    const TokenGatedDao = await ethers.getContractFactory("TokenGatedDao");
    const tokenGatedDao = await TokenGatedDao.deploy("0xD590c2ED8aC1181a20680D114ab197504b445b9F");
    await tokenGatedDao.deployed();

    expect(await tokenGatedDao.getProposal(0)).to.equal({});

    const proposal = await tokenGatedDao.createProposal("Hola, mundo!");

    // wait until the transaction is mined
    await proposal.wait();

    expect(await tokenGatedDao.getProposal(0)).to.equal({});
  });
});
