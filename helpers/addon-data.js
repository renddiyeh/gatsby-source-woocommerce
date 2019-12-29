const isAddonData = (fieldName) => fieldName.startsWith('data');
const randomId = () => Math.floor(Math.random()*10000000);
const getWCNodeId = (node, fieldName) => {
  if (!node) {
    console.log('Node is invalid:', node, fieldName);
    return node;
  }
  return node && node.id ? node.id : node && node.code ? `${fieldName}-${node.code}` : `${fieldName}-${randomId()}`;
};

const mapNodeNormalizeMetadata = (nodes) => {
  return nodes.map(node => {
    if (!node.meta_data || node.meta_data.length === 0) return node;
    node.meta_data = node.meta_data.map((meta) => {
      let value = Array.isArray(meta.value) ? meta.value : [meta.value];
      value = value.map(val => String(val));
      return {...meta, ...{value}};
    });
    return node;
  })
};


module.exports = {
  getWCNodeId,
  mapNodeNormalizeMetadata
};
