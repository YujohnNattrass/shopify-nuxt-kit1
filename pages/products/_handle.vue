<script>
import { mapGetters } from 'vuex'

export default {
  async asyncData({ $http, route }) {
    const productData = await $http.$post('/api/get-product', {
      itemHandle: route.params.handle,
    })

    return {
      product: productData,
    }
  },
  data: () => ({
    selectedProductId: '',
    selectedProductQty: 1,
  }),
  head: () => ({
    title: 'Shoperoni - Product',
  }),
  computed: {
    ...mapGetters({
      cartId: 'cart/id',
    }),
    featuredImage() {
      return this.product.shopifyProduct.featuredImage
    },
    maxQuantity() {
      if (this.selectedProduct) {
        return this.selectedProduct.inventoryQuantity
      } else {
        return 0
      }
    },
    productVariants() {
      return this.product.shopifyProduct.variants
    },
    selectedProduct() {
      return this.product.shopifyProduct.variants.find((item) => {
        return item.id === this.selectedProductId
      })
    },
  },
  mounted() {
    // Set default selected item
    this.selectedProductId = this.productVariants[0].id

    // Get local cart
    const localCart = window.localStorage.getItem('shopifyNuxtCart')

    if (localCart) {
      this.$store.dispatch('cart/updateBase', JSON.parse(localCart))
    }
  },
  methods: {
    async addToCart() {
      const cartResponse = await this.$http.$post('/api/add-to-cart', {
        cartId: this.cartId,
        itemId: this.selectedProductId,
        quantity: this.selectedProductQty,
      })

      this.$store.dispatch('cart/updateBase', cartResponse)
      window.localStorage.setItem('shopifyNuxtCartId', this.cartId)
    },
    currency(price) {
      const amount = Number(price.amount).toFixed(2)

      return '$' + amount + ` ${price.currencyCode}`
    },
  },
}
</script>

<template>
  <main class="product-page">
    <article>
      <section class="product-page-content">
        <div>
          <img
            class="product-page-image"
            :src="featuredImage.src"
            :alt="featuredImage.altText"
          />
        </div>
        <div>
          <h1>{{ product.title }}</h1>
          <p>{{ product.description }}</p>
          <form method="POST" @submit.prevent="addToCart">
            <div
              v-if="productVariants.length > 1"
              class="product-page-price-list"
            >
              <div
                v-for="{ node: variant } in productVariants"
                :key="variant.id"
                class="product-page-price"
              >
                <input
                  :id="variant.id"
                  v-model="selectedProductId"
                  type="radio"
                  name="merchandiseId"
                  :value="variant.id"
                  :disabled="variant.inventoryQuantity === 0"
                />
                <label :for="variant.id">
                  {{ variant.title }} -
                  {{ currency(variant.presentmentPrices[0].price) }}
                  <span v-if="variant.inventoryQuantity > 10">(10+ left)</span>
                  <span v-else-if="variant.inventoryQuantity > 0">
                    (Only {{ variant.inventoryQuantity }} left)
                  </span>
                  <span v-else> (Bummer. It's sold out!) </span>
                </label>
              </div>
            </div>
            <div v-else class="product-page-price is-solo">
              {{ currency(productVariants[0].presentmentPrices[0].price) }}
              <span v-if="productVariants[0].inventoryQuantity > 10">
                (10+ left)
              </span>
              <span v-else-if="productVariants[0].inventoryQuantity > 0">
                (Only {{ productVariants[0].inventoryQuantity }} left)
              </span>
              <span v-else> (Bummer. It's sold out!) </span>
            </div>
            <div class="product-page-quantity-row">
              <input
                v-model.number="selectedProductQty"
                class="product-page-quantity-input"
                type="number"
                name="quantity"
                min="0"
                :max="maxQuantity"
              />

              <button type="submit" class="button purchase">Add to Cart</button>
            </div>
          </form>
        </div>
      </section>
    </article>
  </main>
</template>

<style lang="scss" scoped>
.product-page {
  margin: 60px 0;
}

.product-page-content {
  width: 80%;
  margin: 30px auto 0;

  @include breakpoint($deviceLg) {
    display: grid;
    justify-content: space-between;
    justify-items: center;
    align-items: center;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 30px;
  }
}

.product-page-image {
  width: 100%;
  margin-bottom: 30px;

  @include breakpoint($deviceLg) {
    width: 100%;
    margin-bottom: 0;
  }
}

.product-page-price {
  color: $brandprimary;
  font-size: 1.2rem;
  margin: 5px 0;
  font-weight: normal;
  font-family: $fontSerif;

  &.is-solo {
    margin-bottom: 30px;
  }
}

.product-page-price-list {
  margin-bottom: 30px;
}

.product-page-quantity-input {
  width: 70px;
}

.product-page-quantity-row {
  display: flex;
}
</style>
