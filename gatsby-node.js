const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const {
  processNode,
  normaliseFieldName,
  mapMediaToNodes,
  mapProductsToCategories,
  mapProductsToTags,
  mapRelatedProducts,
  mapGroupedProducts,
  asyncGetProductVariations,
} = require("./helpers")

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, store, cache },
  configOptions
) => {
  const { createNode, touchNode } = actions
  delete configOptions.plugins

  const {
    api,
    https,
    api_keys,
    fields,
    api_version = "wc/v3",
    per_page,
  } = configOptions

  // set up WooCommerce node api tool
  const WooCommerce = new WooCommerceRestApi({
    url: `http${https ? "s" : ""}://${api}`,
    consumerKey: api_keys.consumer_key,
    consumerSecret: api_keys.consumer_secret,
    version: api_version,
  })

  // Fetch Node and turn our response to JSON
  const fetchNodes = async fieldName => {
    let data_ = [];
    let page = 1;
    let pages;

    do {
      let args = per_page ? { per_page, page } : { page }
      const res = await WooCommerce.get(fieldName, args);

      if (res.status !== 200) {
        console.warn(`
          \n========== WARNING FOR FIELD ${fieldName} ==========\n`)
        console.warn(`The following error message was produced: ${res.data}`)
        console.warn(`\n========== END WARNING ==========\n`)
        return []
      }

      data_ = [...data_, ...res.data];
      pages = parseInt(res.headers['x-wp-totalpages']);
      page++
    } while (page <= pages);

    return data_;
  }

  // Loop over each field set in configOptions and process/create nodes
  async function fetchNodesAndCreate(array) {
    let nodes = []
    for (const field of array) {
      const fieldName = normaliseFieldName(field)
      let tempNodes = await fetchNodes(field)
      tempNodes = tempNodes.map(node => ({
        ...node,
        id: createNodeId(`woocommerce-${fieldName}-${node.id}`),
        wordpress_id: node.id,
        __type: `wc${fieldName[0].toUpperCase() + fieldName.slice(1)}`,
      }))
      nodes = nodes.concat(tempNodes)
    }

    nodes = await asyncGetProductVariations(nodes, WooCommerce)
    nodes = await mapMediaToNodes({
      nodes,
      store,
      cache,
      createNode,
      createNodeId,
      touchNode,
    })

    nodes = mapProductsToCategories(nodes)
    nodes = mapProductsToTags(nodes)
    nodes = mapRelatedProducts(nodes)
    nodes = mapGroupedProducts(nodes)

    nodes = nodes.map(node => processNode(createContentDigest, node))

    nodes.forEach(node => {
      createNode(node)
    })
  }

  await fetchNodesAndCreate(fields)
  return
}
