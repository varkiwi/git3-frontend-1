export default class GitRepositoryError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GitRepositoryError';
    }
}
