const hasProductInCart = (array, productAvailable) => {
  let product;
  let cartvalue = 0;
  array?.map((item) => {
    cartvalue += item.price;
    if (item.product === productAvailable) {
      product = item;
    }
  });
  return { product: product, cartvalue: cartvalue };
};

export default hasProductInCart;
