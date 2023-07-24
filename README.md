# Mauve Subgraph

### Subgraph Endpoint

Synced at: https://thegraph.com/hosted-service/subgraph/violetprotocol/phlox-subgraph

Pending Changes at same URL

## Deployment

### Install dependencies

```
yarn install:all
```

### Update subgraph schema

Depending on whether working on testnet or production subgraph, please work out of the relevant `phlox` or `mauve` directories respectively.

Make any additions or changes to the `subgraph.yaml` file to include contracts and entity declarations here.

Ensure that any entity declarations and ABIs referenced exist and are defined well. The `schema.graphql` file contains all object structures queryable through the graph.

### Configure networks

Populate the `networks.json` file with the contracts for each network that you are defining subgraphs for.

### Generate types

```
yarn codegen
```

### Compile subgraph

```
yarn build -network <network>
```

### Deploy subgraph

For production:

```
yarn deploy mainnet
```

For testnet:

```
yarn deploy optimism-goerli
```
