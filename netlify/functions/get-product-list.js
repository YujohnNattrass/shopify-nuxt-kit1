/**
 * API Endpoint
 *
 * Purpose: Fetch first 100 products of the store
 *
 * Example:
 * ```
 * fetch('/.netlify/functions/get-product-list', {
 *   method: 'POST'
 * })
 * ```
 *
 * ! POST method is intentional for future enhancement
 *
 * TODO: Add enhancement for pagination
 */

const { postToConnect } = require('./utils/postToConnect')
exports.handler = async () => {
  try {
    console.log('--------------------------------')
    console.log('Retrieving product list...')
    console.log('--------------------------------')

    const query = `
    query getProductList {
      allShopifyProduct(sort: {title: ASC}, limit: 100) {
        edges {
          node {
            id
            handle
            description
            title
            productType
            totalInventory
            variants {
              id
              title
              inventoryQuantity
              presentmentPrices {
                price {
                  amount
                  currencyCode
                }
              }
            }
            priceRangeV2 {
              maxVariantPrice {
                amount
                currencyCode
              }
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              src
              altText
            }
          }
        }
      }
    }
      `

    const result = await postToConnect({
      query,
    })
    console.log(JSON.stringify(result, null, 2))

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  } catch (error) {
    console.log(error)
  }
}
