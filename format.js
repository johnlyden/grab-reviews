const data = require('./data.json');

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
const groupedByProductId = groupBy(data, (data) => data.productId);

groupedByProductId.forEach((product) => {
  const prodId = product[0].productId;
  const numOfReviews = product.length;
  // console.log(product);
  const numOfRecommends = product.filter((obj) => obj.bottomLine === 'Yes')
    .length;
  const numOfDontRecommends = product.filter((obj) => obj.bottomLine === 'No')
    .length;
  const averageRating =
    product.reduce((total, next) => total + next.rating, 0) / product.length;
  const numOf5StarRatings = product.filter((obj) => obj.rating === 5).length;
  const numOf4StarRatings = product.filter((obj) => obj.rating === 4).length;
  const numOf3StarRatings = product.filter((obj) => obj.rating === 3).length;
  const numOf2StarRatings = product.filter((obj) => obj.rating === 2).length;
  const numOf1StarRatings = product.filter((obj) => obj.rating === 1).length;
  // console.log(`${numOf5StarRatings} number of 5 star ratings`);
  const dataObject = {
    averageRating,
    prodId,
    numOfReviews,
    numOfRecommends,
    numOfDontRecommends,
    numOf5StarRatings,
    numOf4StarRatings,
    numOf3StarRatings,
    numOf2StarRatings,
    numOf1StarRatings,
  };

  console.log({ dataObject });
  // console.log(
  //   `${prodId}: ${averageRating} stars out of ${numOfReviews} number of reviews`
  // );
  // console.log(`${numOfRecommends} of people say Yes they recommend`);
  // console.log(
  //   `${numOfDontRecommends} of people say No they wouldn't recommend`
  // );
});
