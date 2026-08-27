import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart', () => {
  test('should add a single product to the cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.closeAddedModalAndContinueShopping();

    await productsPage.goToCart();
    await expect(cartPage.cartRows).toHaveCount(1);
  });

  test('should add multiple products and reflect the correct item count', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.closeAddedModalAndContinueShopping();
    await productsPage.addProductToCartByIndex(1);
    await productsPage.closeAddedModalAndContinueShopping();

    await productsPage.goToCart();
    await expect(cartPage.cartRows).toHaveCount(2);
  });

  test('should remove a product from the cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.closeAddedModalAndContinueShopping();

    await productsPage.goToCart();
    await expect(cartPage.cartRows).toHaveCount(1);

    await cartPage.removeProductByIndex(0);
    await expect(cartPage.cartRows).toHaveCount(0);
  });

  test('should prompt login/register when proceeding to checkout as a guest', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.closeAddedModalAndContinueShopping();

    await productsPage.goToCart();
    await cartPage.proceedToCheckout();

    // Be specific: check the guest-checkout prompt paragraph is visible
    await expect(page.getByText('Register / Login account to proceed on checkout.')).toBeVisible();
  });
});
