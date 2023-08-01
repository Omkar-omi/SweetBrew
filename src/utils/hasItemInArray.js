const hasItemInArray = (array, productAvailable) => {
  let value = false;
  array?.map((item) => {
    if (item.product === productAvailable) {
      value = true;
    }
  });
  return value;
};

export default hasItemInArray;
