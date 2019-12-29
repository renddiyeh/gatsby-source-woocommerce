const { getWCNodeId, mapNodeNormalizeMetadata } = require("../helpers/misc-data");

describe("Helpers - Misc Data:", () => {

  describe("getWCNodeId", () => {
    const fieldName = 'data';

    it("should properly return id when exists", () => {
      const node = {id: 'testid'};
      expect(getWCNodeId(node, fieldName)).toEqual(node.id);
    });

    it("should properly return composed code-id when code prop exists", () => {
      const node = {code: 'abc123'};
      expect(getWCNodeId(node, fieldName)).toEqual(`${fieldName}-${node.code}`);
    });

    it("should properly return a random id when id or code does not exists", () => {
      const node = {};
      expect(getWCNodeId(node, fieldName)).toContain(fieldName);
    });
  });

  describe("mapNodeNormalizeMetadata", () => {
    it("should always return metadata as a string array", () => {
      const nodeNoMetadata = {};
      const nodeMetadataArray = {meta_data: [{value: ["val"]}]};
      const nodeMetadataString = {meta_data: [{value: "stringval"}]};
      const nodeMetadataNumber = {meta_data: [{value: 50}]};

      const nodes = [nodeNoMetadata, nodeMetadataArray, nodeMetadataString, nodeMetadataNumber];
      const nodesWithMeta = mapNodeNormalizeMetadata(nodes);
      expect(nodesWithMeta[0].meta_data).toBeFalsy();
      expect(nodesWithMeta[1].meta_data[0].value).toEqual(nodeMetadataArray.meta_data[0].value);
      expect(nodesWithMeta[2].meta_data[0].value).toEqual([nodeMetadataString.meta_data[0].value]);
      expect(nodesWithMeta[3].meta_data[0].value).toEqual([String(nodeMetadataNumber.meta_data[0].value)]);
    });

  });

});
