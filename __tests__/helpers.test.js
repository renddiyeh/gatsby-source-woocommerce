const { normaliseFieldName, } = require('../helpers/');

describe('Helpers:', () => {

  it('should normalize fieldname', () => {
    expect(normaliseFieldName('products/cateGorIes')).toEqual('productsCategories')
    expect(normaliseFieldName('products/categories')).toEqual('productsCategories')
  });

});
