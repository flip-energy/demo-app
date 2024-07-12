const ENODE_API_BASE_URL = `https://enode-api.${process.env.ENODE_ENVIRONMENT}.enode.io`;
const ENODE_LINK_BASE_URL = `https://link.${process.env.ENODE_ENVIRONMENT}.enode.io`;
const ENODE_OAUTH_TOKEN_URL = `https://oauth.${process.env.ENODE_ENVIRONMENT}.enode.io/oauth2/token`;

export { ENODE_API_BASE_URL, ENODE_LINK_BASE_URL, ENODE_OAUTH_TOKEN_URL };
