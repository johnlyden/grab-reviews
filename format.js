const fs = require('fs');
const chalk = require('chalk');

const data1 = require('./page-1-400.json');
const data2 = require('./backwards-from-oldest.json');

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

// having issues past requesting beyond the 10,000th review
// so data1 is all reviews in ascending order, and data2 is all reviews in descending order
const data = [...data1, ...data2];
console.log(`total data length: ${data.length}`);

// remove reviews that have the same reviewID
// this is the dupliate reviews that we fetched as well as duplicate reviews
// between product_page_ids that point to the same product.  i.e FS is product_Id "3" and "55"
uniqueData = data.filter(
  (thing, index, self) =>
    index === self.findIndex((t) => t.reviewId === thing.reviewId)
);

console.log(
  `this should be the unique reviews from the api: ${uniqueData.length}`
);

// group the reviews by product ID
const groupedByProductId = groupBy(uniqueData, (data) => data.productId);

const arrayOfFormattedObjects = [];

groupedByProductId.forEach((product) => {
  const prodId = product[0].productId;
  const numOfReviews = product.length;
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

  arrayOfFormattedObjects.push(dataObject);
});

const outputFile = 'formattedReviewes.json';

fs.writeFile(
  outputFile,
  JSON.stringify(arrayOfFormattedObjects, null, 4),
  (err) => {
    if (err) {
      console.log(err);
    }
    console.log(
      chalk.yellow.bgBlue(
        `\n ${chalk.underline.bold(
          arrayOfFormattedObjects.length
        )} Results exported successfully to ${chalk.underline.bold(
          outputFile
        )}\n`
      )
    );
  }
);
