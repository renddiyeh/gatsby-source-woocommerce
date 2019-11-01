const { normaliseFieldName, processNode, } = require('../helpers/');

describe('Helpers:', () => {

  it('should normalize fieldname', () => {
    expect(normaliseFieldName('products/cateGorIes')).toEqual('productsCategories')
    expect(normaliseFieldName('products/categories')).toEqual('productsCategories')
  });

  it('should creates processNode', () => {
    const __type = 'wcProducts';
    const nodeWithOutType = {
      id: 1345,
      categories: [{ id: 23 }],
      wordpress_id: 1345,
    };
    const node = {
      __type,
      ...nodeWithOutType
    };
    const contentDigest = 19;
    const createContentDigest = jest.fn(() => contentDigest);
    const processNodeResult = processNode(createContentDigest, node);
    
    expect(createContentDigest).toBeCalled();
    expect(processNodeResult).toEqual({
      ...nodeWithOutType,
      parent: null,
      children: [],
      internal: {
        type: __type,
        contentDigest,
      },
    });
    
  });
  
});
