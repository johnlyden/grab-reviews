require('dotenv').config();
const apiKey = process.env.POWER_REVIEW_READ_API_KEY;
const merchantID = process.env.POWER_REVIEW_MERCHANT_ID;
// External dependencies
const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');

const url = `https://readservices-b2c.powerreviews.com/m/${merchantID}/reviews?sort=Newest&apikey=${apiKey}&date=1420092000000`;
const outputFile = 'data.json';
const parsedResults = [];

console.log(
  chalk.yellow.bgBlue(
    `\n  Scraping of ${chalk.underline.bold(url)} initiated...\n`
  )
);

const getWebsiteContent = async (url) => {
  try {
    const response = await axios.get(url);
    const totalResults = response.data.paging.total_results || 9999999;
    const totalPages = response.data.paging.pages_total;
    const currentPage = response.data.paging.current_page_number;
    console.log(`just got response for page: ${currentPage}`);
    const nextPageUrl = response.data.paging.next_page_url;
    const pageReviews = response.data.results[0].reviews;

    for (var i = 0; i < pageReviews.length; i++) {
      const review = pageReviews[i];
      const reviewId = review.review_id;
      const productId = review.details.product_page_id;
      const rating = review.metrics.rating;
      const bottomLine = review.details.bottom_line;
      const metadata = {
        productId,
        rating,
        bottomLine,
        reviewId,
      };
      parsedResults.push(metadata);
    }

    if (currentPage === 10) {
      console.log(
        `this was the last page, which was ${currentPage} because apparently we have ${totalPages} total pages`
      );
      exportResults(parsedResults, totalResults);
      return false;
    }

    console.log(`requesting data for the next page: ${currentPage + 1}`);
    setTimeout(() => {
      getWebsiteContent(
        `https://readservices-b2c.powerreviews.com${nextPageUrl}&apikey=${apiKey}`
      );
    }, 1000);
  } catch (error) {
    console.error(error);
    exportResults(parsedResults, totalResults);
  }
};

const exportResults = (parsedResults, numOfResults) => {
  console.log(`inside of the exportResults function`);
  fs.writeFile(outputFile, JSON.stringify(parsedResults, null, 4), (err) => {
    if (err) {
      console.log(err);
    }
    console.log(chalk.yellow(`\n out of ${numOfResults}`));
    console.log(
      chalk.yellow.bgBlue(
        `\n ${chalk.underline.bold(
          parsedResults.length
        )} Results exported successfully to ${chalk.underline.bold(
          outputFile
        )}\n`
      )
    );
  });
};

getWebsiteContent(url);
