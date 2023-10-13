/**
 * Get Product API Endpoint
 *
 * * Purpose: Retrieve data on a specific product
 * @param {string} itemHandle - kebab-cased-product-name
 *
 * Example:
 * ```
 * fetch('/.netlify/functions/get-product', {
 *   method: 'POST',
 *   body: JSON.stringify({ itemHandle: 'my-product' })
 * })
 * ```
 */

const { postToConnect } = require('./utils/postToConnect')
// const { postToShopify } = require('./utils/postToShopify')

exports.handler = async (event) => {
  const { itemHandle } = JSON.parse(event.body)

  try {
    console.log('--------------------------------')
    console.log('Retrieving product details...')
    console.log('--------------------------------')
    const connectResponse = await postToConnect({
      query: `query getProductList($handle: String!) {
        shopifyProduct(handle: {eq: $handle }) {
          id
          handle
          description
          title
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
      }`,
      variables: {
        handle: itemHandle,
      },
    })

    return {
      statusCode: 200,
      body: JSON.stringify(connectResponse),
    }
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
  }
}
