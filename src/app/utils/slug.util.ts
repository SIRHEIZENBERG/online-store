export class SlugUtil {
  /**
   * Generate a slug from product title and ID
   * Example: "Wireless Headphones" + "abc123def456" -> "wireless-headphones-abc123"
   */
  static generateSlug(title: string, id: string): string {
    const titleSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen

    // Use first 6 characters of ID for shorter URLs
    const shortId = id.substring(0, 6);

    return `${titleSlug}-${shortId}`;
  }

  /**
   * Extract product ID from slug
   * Example: "wireless-headphones-abc123" -> "abc123"
   */
  static extractIdFromSlug(slug: string): string {
    const parts = slug.split('-');
    return parts[parts.length - 1]; // Last segment is the ID
  }

  /**
   * Find product ID from slug by matching against product list
   * More reliable method when you have the full ID
   */
  static findProductId(slug: string, products: any[]): string | null {
    const shortId = this.extractIdFromSlug(slug);
    const product = products.find((p) => p.id?.startsWith(shortId));
    return product?.id || null;
  }
}
