# Mauve Subgraph

### Subgraph Endpoint

Synced at: https://thegraph.com/hosted-service/subgraph/violetprotocol/phlox-subgraph

Pending Changes at same URL

## Deployment

### Install dependencies

```
yarn install
```

### Update subgraph schema

Make any additions or changes to the `subgraph.yaml` file to include contracts and entity declarations here.

Ensure that any entity declarations and ABIs referenced exist and are defined well. The `schema.graphql` file contains all object structures queryable through the graph.

### Generate types

```
yarn codegen
```

### Compile subgraph

```
yarn build
```

### Deploy subgraph

```
yarn deploy
```
