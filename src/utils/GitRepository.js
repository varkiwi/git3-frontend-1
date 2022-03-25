import { ethers } from 'ethers';

import GitRepositoryError from './Errors';
import gitBranchJson from '../assets/contracts/facets/GitBranch.sol/GitBranch.json';
import gitTipsJson from '../assets/contracts/facets/GitTips.sol/GitTips.json';
import gitIssuesJson from '../assets/contracts/facets/GitIssues.sol/GitIssues.json';

export default class GitRepository {
    #gitBranchContract;

    #gitTipsContract;

    #gitIssuesContract;

    #gitRepoAddress;

    #signer;

    #provider

    /**
     * Constructor for the GitRepository class. It takes two parameter which are
     * used to instantiate the underlying smart contracts.
     * @param {*} address - Address of the GitRepository proxy contract
     * @param {*} provider - Provider which is connected to a chain where the contract resides
     */
    constructor(address, provider) {
        this.#gitBranchContract = new ethers.Contract(address, gitBranchJson.abi, provider);
        this.#gitTipsContract = new ethers.Contract(address, gitTipsJson.abi, provider);
        this.#gitIssuesContract = new ethers.Contract(address, gitIssuesJson.abi, provider);
        this.#gitRepoAddress = address;
        this.#provider = provider;
    }

    /**
     * The getBranch method returns the branch stored in the Smart Contract based on the
     * given branchName parameter
     * @param {String} branchName - String which is the branch name
     * @returns
     */
    getBranch(branchName) {
        return this.#gitBranchContract.functions.getBranch(branchName);
    }

    /**
     * Opens a new issue in the repository. It takes a cid and stores it in the contract.
     * @param {String} cid - Cid to the issue data
     * @returns {Promise} Returns a promise once the transaction has been send to the network
     */
    openIssue(cid, overrides) {
        if (!this.#signer) throw new GitRepositoryError('Signer is not set. Can\'t send transaction');
        return this.#gitIssuesContract.connect(this.#signer).functions.openIssue(cid, overrides);
    }

    /**
     * Returns a promise with all issue hashes in an array.
     *
     * @returns {Promise} Returns a promise with an array of hashes
     */
    get allIssues() {
        return this.#gitIssuesContract.functions.getAllIssues();
    }

    /**
     * Returns an issue based on the given hash
     *
     * @param {String} userCidHash - Hash under which the issue is saved in the contract
     * @returns {Promise} Returns a promise with the issue data
     */
    issue(hash) {
        return this.#gitIssuesContract.functions.getIssue(hash);
    }

    /**
     * Appends an answer to an issue.
     *
     * @param {String} issueHash - Hash of the issue to which the answer is added
     * @param {String} issueAnswerCid - Cid to get the answer data
     * @returns {Promise} Returns a promise.
     */
    appendAnswerToIssue(issueHash, issueAnswerCid, overrides) {
        return this.#gitIssuesContract
            .connect(this.#signer)
            .functions
            .appendAnswerToIssue(issueHash, issueAnswerCid, overrides);
    }

    /**
     * This function is used to change the state of an issue.
     *
     * @param {String} issueHash - Hash of the issue to which the answer is added
     * @param {Number} state - The new state of the issue.
     */
    updateIssueState(issueHash, state) {
        return this.#gitIssuesContract
            .connect(this.#signer)
            .functions
            .updateIssueState(issueHash, state);
    }

    getUserCidHash(openerAddress, cid) {
        return this.#gitIssuesContract.functions.getUserCidHash(openerAddress, cid);
    }

    /**
     * The getBranchNames method return all the branch names of the repository.
     * @returns {Array} Array of strings, which represent the branch names
     */
    async getBranchNames() {
        return this.#gitBranchContract.functions.getBranchNames();
    }

    /**
     * Getter for the address of the repository contract
     * @returns {String}
     */
    get repositoryAddress() {
        return this.#gitRepoAddress;
    }

    /**
     * Getter for the number of donations the contract has received.
     * @returns {String} The number of coins the repository owner has received, parsed to Ether (not wei)
     */
    get tips() {
        return this.#gitTipsContract.functions.getTips()
            .then((data) => ethers.utils.formatEther(data[0].toString()));
    }

    /**
     * The collect tips function is used by the owner of the repository to collect the donations received.
     * @returns {Promise} Returns a promise once the transaction has been send to the network
     */
    collectTips() {
        if (!this.#signer) throw new GitRepositoryError('Signer is not set. Can\'t send transaction');
        return this.#gitTipsContract.connect(this.#signer).functions.collectTips();
    }

    /**
     * Setter to set the signer
     * @param {Object} signer - Signer, which job is to sign and send transaction
     */
    set web3Signer(signer) {
        this.#signer = signer;
    }

    get web3Signer() {
        return this.#signer;
    }

    get web3Provider() {
        return this.#provider;
    }
}
