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

### Generate types

```
yarn codegen-all
```

### Compile subgraph

```
yarn build-all
```

### Deploy subgraph

For production:

```
yarn mauve:deploy
```

For testnet:

```
yarn phlox:deploy
```
