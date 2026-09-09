import { getImageUrl } from './image-utils';

/**
 * Helpers for custom made products (e.g. personalised mugs).
 *
 * A custom made product is an ordinary product that additionally carries a set of
 * designs the customer picks from, plus a short text printed on the product. Both
 * come from the backend: `customMade` and `designImageList` on the product.
 */

/** Maximum number of characters the customer may print on the product. */
export const CUSTOM_TEXT_MAX_LENGTH = 12;

/** True when the product has to be personalised before it can be bought. */
export const isCustomProduct = (product) => {
    if (!product) return false;
    return product.customMade === true || product.designImageList?.length > 0;
};

/** Designs the customer can choose from, normalised to `{ id, name, imageUrl }`. */
export const getCustomProductDesigns = (product) => {
    if (!product?.designImageList?.length) return [];

    return product.designImageList.map((design, index) => ({
        id: design.id,
        name: design.name || `Dizajn ${index + 1}`,
        imageUrl: getImageUrl(design.detailsPath ?? design.path)
    }));
};

/**
 * Builds the cart line for a personalised product. The same product ordered with
 * a different design or text is a separate line, so the cart id embeds both while
 * `productId` keeps pointing at the real product.
 */
export const buildCustomCartItem = (product, design, text) => {
    const customText = text.trim();

    return {
        ...product,
        id: `custom-${product.id}-${design.id}-${customText.toLowerCase()}`,
        productId: product.id,
        customization: {
            designId: design.id,
            designName: design.name,
            designImageUrl: design.imageUrl,
            text: customText
        }
    };
};
