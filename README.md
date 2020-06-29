# grab-reviews
grab-reviews

you need to add a .env file with `POWER_REVIEW_READ_API_KEY` and `POWER_REVIEW_MERCHANT_ID`

run `npm start` to make api requests to pull all data

run `node format` to run through the array of objects to produce an object like this for each item.  

```
  dataObject: {
    averageRating: 4.8875,
    prodId: '3',
    numOfReviews: 80,
    numOfRecommends: 77,
    numOfDontRecommends: 1,
    numOf5StarRatings: 71,
    numOf4StarRatings: 9,
    numOf3StarRatings: 0,
    numOf2StarRatings: 0,
    numOf1StarRatings: 0
  }
```
