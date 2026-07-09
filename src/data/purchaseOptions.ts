/**
 * Where to Buy — Purchase options for athlete foods.
 *
 * Maps food IDs → array of purchase options with store, price, and links.
 * Prices are approximate US averages as of mid-2026.
 */

export interface PurchaseOption {
  store: string;
  storeType: 'grocery' | 'online' | 'warehouse' | 'specialty';
  priceRange: string;
  unit: string;
  link?: string;
  note?: string;
  badge?: 'best-value' | 'highest-quality' | 'most-convenient';
}

export const purchaseOptions: Record<string, PurchaseOption[]> = {
  // ── Macronutrients ───────────────────────────────────────────────────

  'sweet-potato': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$0.88–1.28', unit: 'per lb', link: 'https://www.walmart.com/search?q=sweet+potatoes', badge: 'best-value' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$1.99–2.49', unit: 'per lb', link: 'https://www.wholefoodsmarket.com/', badge: 'highest-quality', note: 'Organic available year-round' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$0.69–0.99', unit: 'per lb', link: 'https://www.costco.com/', note: '5–10 lb bags for bulk meal prep' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$1.29–1.79', unit: 'per lb' },
  ],

  'whey-isolate': [
    { store: 'Amazon', storeType: 'online', priceRange: '$29.99–44.99', unit: 'per 2lb tub', link: 'https://www.amazon.com/s?k=whey+protein+isolate+grass+fed', badge: 'most-convenient', note: 'Subscribe & Save −15%' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$39.99–49.99', unit: 'per 3lb tub', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=whey+protein+isolate', badge: 'best-value', note: 'Kirkland Signature or Optimum Nutrition' },
    { store: 'iHerb', storeType: 'online', priceRange: '$32.99–42.99', unit: 'per 2lb tub', link: 'https://www.iherb.com/c/whey-protein-isolate', badge: 'highest-quality' },
    { store: 'GNC', storeType: 'specialty', priceRange: '$34.99–54.99', unit: 'per 2lb tub', link: 'https://www.gnc.com/search?q=whey+protein+isolate' },
  ],

  'eggs': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$2.98–4.48', unit: 'per dozen', link: 'https://www.walmart.com/search?q=eggs', badge: 'best-value' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$6.99–9.99', unit: 'per 2 dozen', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=organic+eggs', note: 'Organic cage-free — best bulk price' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$4.99–7.49', unit: 'per dozen', badge: 'highest-quality', note: 'Pasture-raised available' },
    { store: 'Target', storeType: 'grocery', priceRange: '$3.29–4.99', unit: 'per dozen', link: 'https://www.target.com/s?searchTerm=eggs' },
  ],

  'salmon': [
    { store: 'Costco', storeType: 'warehouse', priceRange: '$8.99–12.99', unit: 'per lb', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=wild+caught+salmon', badge: 'best-value', note: 'Wild-caught Alaskan sockeye in bulk packs' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$12.99–16.99', unit: 'per lb', badge: 'highest-quality', note: 'Fresh Atlantic and wild-caught options' },
    { store: 'Walmart', storeType: 'grocery', priceRange: '$7.98–10.98', unit: 'per lb', link: 'https://www.walmart.com/search?q=salmon+fillet' },
    { store: 'Amazon Fresh', storeType: 'online', priceRange: '$10.99–14.99', unit: 'per lb', link: 'https://www.amazon.com/s?k=wild+caught+salmon', badge: 'most-convenient' },
  ],

  'oatmeal': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$2.98–4.48', unit: 'per 42oz canister', link: 'https://www.walmart.com/search?q=old+fashioned+oats', badge: 'best-value' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$7.99–9.99', unit: 'per 10lb bag', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=oats', note: 'Quaker or organic — lasts months' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$2.49–3.49', unit: 'per 32oz' },
    { store: 'Amazon', storeType: 'online', priceRange: '$4.99–8.99', unit: 'per 42oz', link: 'https://www.amazon.com/s?k=steel+cut+oats', badge: 'most-convenient' },
  ],

  'chicken-breast': [
    { store: 'Costco', storeType: 'warehouse', priceRange: '$2.99–3.49', unit: 'per lb', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=chicken+breast', badge: 'best-value', note: 'Bulk boneless/skinless — freezes well' },
    { store: 'Walmart', storeType: 'grocery', priceRange: '$3.18–4.28', unit: 'per lb', link: 'https://www.walmart.com/search?q=chicken+breast' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$5.99–8.99', unit: 'per lb', badge: 'highest-quality', note: 'Organic, air-chilled' },
    { store: 'Target', storeType: 'grocery', priceRange: '$3.49–4.99', unit: 'per lb', link: 'https://www.target.com/s?searchTerm=chicken+breast' },
  ],

  'greek-yogurt': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$4.48–5.98', unit: 'per 32oz tub', link: 'https://www.walmart.com/search?q=greek+yogurt', badge: 'best-value' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$5.99–7.99', unit: 'per 48oz tub', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=greek+yogurt', note: 'Kirkland or FAGE — best per-oz price' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$4.49–5.49', unit: 'per 32oz' },
    { store: 'Target', storeType: 'grocery', priceRange: '$4.99–6.49', unit: 'per 32oz', link: 'https://www.target.com/s?searchTerm=greek+yogurt' },
  ],

  'quinoa': [
    { store: 'Costco', storeType: 'warehouse', priceRange: '$7.99–9.99', unit: 'per 4lb bag', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=quinoa', badge: 'best-value', note: 'Organic tri-color' },
    { store: 'Walmart', storeType: 'grocery', priceRange: '$3.98–5.48', unit: 'per 16oz', link: 'https://www.walmart.com/search?q=quinoa' },
    { store: 'Amazon', storeType: 'online', priceRange: '$5.99–9.99', unit: 'per 2lb', link: 'https://www.amazon.com/s?k=organic+quinoa', badge: 'most-convenient' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$4.99–6.99', unit: 'per 16oz', badge: 'highest-quality' },
  ],

  'brown-rice': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$1.98–3.48', unit: 'per 2lb bag', link: 'https://www.walmart.com/search?q=brown+rice', badge: 'best-value' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$8.99–11.99', unit: 'per 15lb bag', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=brown+rice', note: 'Bulk buy — pennies per serving' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$2.49–3.29', unit: 'per 2lb' },
    { store: 'Amazon', storeType: 'online', priceRange: '$3.99–7.99', unit: 'per 2lb', link: 'https://www.amazon.com/s?k=brown+rice', badge: 'most-convenient' },
  ],

  'avocado': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$0.78–1.28', unit: 'each', link: 'https://www.walmart.com/search?q=avocado', badge: 'best-value' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$4.99–6.99', unit: 'per 5-pack', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=avocado', note: 'Hass avocados — great value in season' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$1.49–2.29', unit: 'each', badge: 'highest-quality', note: 'Organic available' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$0.99–1.49', unit: 'each' },
  ],

  'banana': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$0.22–0.28', unit: 'each', link: 'https://www.walmart.com/search?q=bananas', badge: 'best-value' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$0.19–0.23', unit: 'each', note: 'Consistently the cheapest bananas' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$1.49–1.99', unit: 'per 3lb bunch', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=bananas' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$0.29–0.39', unit: 'each', badge: 'highest-quality', note: 'Organic Dole or Chiquita' },
  ],

  'lentils': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$1.28–2.28', unit: 'per 16oz bag', link: 'https://www.walmart.com/search?q=dry+lentils', badge: 'best-value' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$6.99–8.99', unit: 'per 5lb bag', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=lentils', note: 'Best bulk price for dry lentils' },
    { store: 'Amazon', storeType: 'online', priceRange: '$3.99–6.99', unit: 'per 2lb', link: 'https://www.amazon.com/s?k=organic+lentils', badge: 'most-convenient' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$2.49–3.99', unit: 'per 16oz', badge: 'highest-quality' },
  ],

  'wild-tuna': [
    { store: 'Costco', storeType: 'warehouse', priceRange: '$14.99–18.99', unit: 'per 8-pack (5oz cans)', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=wild+tuna', badge: 'best-value', note: 'Wild Planet or Kirkland albacore' },
    { store: 'Walmart', storeType: 'grocery', priceRange: '$1.28–2.98', unit: 'per 5oz can', link: 'https://www.walmart.com/search?q=wild+caught+tuna' },
    { store: 'Amazon', storeType: 'online', priceRange: '$19.99–29.99', unit: 'per 12-pack', link: 'https://www.amazon.com/s?k=wild+caught+tuna', badge: 'most-convenient', note: 'Subscribe & Save available' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$2.99–4.49', unit: 'per 5oz can', badge: 'highest-quality' },
  ],

  // ── Hydration & Salts ────────────────────────────────────────────────

  'beetroot-juice': [
    { store: 'Amazon', storeType: 'online', priceRange: '$24.99–34.99', unit: 'per 16-pack shots', link: 'https://www.amazon.com/s?k=beetroot+juice+shots', badge: 'most-convenient', note: 'Beet It Sport or BeetElite' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$3.99–5.99', unit: 'per 8.4oz bottle', badge: 'highest-quality' },
    { store: 'iHerb', storeType: 'online', priceRange: '$19.99–29.99', unit: 'per powder canister', link: 'https://www.iherb.com/search?kw=beetroot+powder' },
    { store: 'Target', storeType: 'grocery', priceRange: '$4.49–6.49', unit: 'per bottle', link: 'https://www.target.com/s?searchTerm=beetroot+juice' },
  ],

  'coconut-water': [
    { store: 'Costco', storeType: 'warehouse', priceRange: '$8.99–12.99', unit: 'per 12-pack', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=coconut+water', badge: 'best-value', note: 'Vita Coco or Kirkland' },
    { store: 'Walmart', storeType: 'grocery', priceRange: '$1.48–2.48', unit: 'per 11.1oz', link: 'https://www.walmart.com/search?q=coconut+water' },
    { store: 'Amazon', storeType: 'online', priceRange: '$14.99–19.99', unit: 'per 12-pack', link: 'https://www.amazon.com/s?k=coconut+water', badge: 'most-convenient', note: 'Subscribe & Save −15%' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$1.49–1.99', unit: 'per 16oz' },
  ],

  'pink-salt': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$3.48–5.48', unit: 'per 2lb bag', link: 'https://www.walmart.com/search?q=himalayan+pink+salt', badge: 'best-value' },
    { store: 'Amazon', storeType: 'online', priceRange: '$5.99–9.99', unit: 'per 2lb', link: 'https://www.amazon.com/s?k=himalayan+pink+salt', badge: 'most-convenient' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$6.99–8.99', unit: 'per 5lb bag', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=himalayan+pink+salt', note: 'Lasts a year for a single household' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$4.99–7.99', unit: 'per 16oz grinder', badge: 'highest-quality' },
  ],

  'watermelon': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$3.98–5.98', unit: 'per whole melon', link: 'https://www.walmart.com/search?q=watermelon', badge: 'best-value', note: 'Seasonal — cheapest May–September' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$4.99–6.99', unit: 'per whole melon', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=watermelon' },
    { store: 'Target', storeType: 'grocery', priceRange: '$4.49–6.49', unit: 'per whole melon', link: 'https://www.target.com/s?searchTerm=watermelon' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$6.99–8.99', unit: 'per whole melon', badge: 'highest-quality', note: 'Organic seedless available' },
  ],

  'bone-broth': [
    { store: 'Amazon', storeType: 'online', priceRange: '$19.99–29.99', unit: 'per 6-pack (8oz)', link: 'https://www.amazon.com/s?k=bone+broth+organic', badge: 'most-convenient', note: 'Kettle & Fire or Bonafide' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$14.99–18.99', unit: 'per 6-pack', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=bone+broth', badge: 'best-value' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$5.99–8.99', unit: 'per 16oz', badge: 'highest-quality', note: 'Fresh, refrigerated options available' },
    { store: 'Walmart', storeType: 'grocery', priceRange: '$3.98–5.98', unit: 'per 32oz carton', link: 'https://www.walmart.com/search?q=bone+broth' },
  ],

  // ── Micronutrients ───────────────────────────────────────────────────

  'spinach': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$2.48–3.48', unit: 'per 16oz bag', link: 'https://www.walmart.com/search?q=baby+spinach', badge: 'best-value' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$3.99–5.49', unit: 'per 1lb clamshell', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=organic+spinach', note: 'Organic baby spinach — bulk size' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$1.99–2.99', unit: 'per 6oz bag' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$3.49–4.99', unit: 'per 10oz', badge: 'highest-quality', note: 'Triple-washed organic' },
  ],

  'blueberries': [
    { store: 'Costco', storeType: 'warehouse', priceRange: '$8.99–12.99', unit: 'per 3lb bag (frozen)', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=organic+blueberries', badge: 'best-value', note: 'Organic frozen — best for smoothies' },
    { store: 'Walmart', storeType: 'grocery', priceRange: '$3.48–4.98', unit: 'per 1 pint', link: 'https://www.walmart.com/search?q=blueberries' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$4.99–6.99', unit: 'per 1 pint', badge: 'highest-quality', note: 'Organic fresh in season' },
    { store: 'Amazon Fresh', storeType: 'online', priceRange: '$4.49–6.49', unit: 'per 1 pint', link: 'https://www.amazon.com/s?k=organic+blueberries', badge: 'most-convenient' },
  ],

  'sweet-peppers': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$2.98–4.48', unit: 'per 3-pack', link: 'https://www.walmart.com/search?q=bell+peppers', badge: 'best-value' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$4.99–6.99', unit: 'per 6-pack', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=bell+peppers' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$2.49–3.49', unit: 'per 3-pack' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$1.99–2.99', unit: 'each', badge: 'highest-quality', note: 'Organic options available' },
  ],

  'broccoli': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$1.28–1.98', unit: 'per crown', link: 'https://www.walmart.com/search?q=broccoli', badge: 'best-value' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$4.99–6.49', unit: 'per 3lb bag (frozen)', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=broccoli', note: 'Organic frozen florets — always in stock' },
    { store: 'Target', storeType: 'grocery', priceRange: '$1.49–2.49', unit: 'per crown', link: 'https://www.target.com/s?searchTerm=broccoli' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$2.49–3.49', unit: 'per bunch', badge: 'highest-quality' },
  ],

  'pumpkin-seeds': [
    { store: 'Costco', storeType: 'warehouse', priceRange: '$7.99–9.99', unit: 'per 2lb bag', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=pumpkin+seeds', badge: 'best-value', note: 'Organic raw pepitas' },
    { store: 'Amazon', storeType: 'online', priceRange: '$8.99–14.99', unit: 'per 2lb', link: 'https://www.amazon.com/s?k=raw+pumpkin+seeds', badge: 'most-convenient' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$3.49–4.49', unit: 'per 12oz' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$5.99–8.99', unit: 'per 16oz', badge: 'highest-quality' },
  ],

  'brazil-nuts': [
    { store: 'Costco', storeType: 'warehouse', priceRange: '$9.99–13.99', unit: 'per 1.5lb bag', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=brazil+nuts', badge: 'best-value' },
    { store: 'Amazon', storeType: 'online', priceRange: '$11.99–16.99', unit: 'per 1lb', link: 'https://www.amazon.com/s?k=brazil+nuts+organic', badge: 'most-convenient' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$8.99–12.99', unit: 'per 10oz', badge: 'highest-quality' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$5.99–7.99', unit: 'per 8oz' },
  ],

  'sardines': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$1.48–2.98', unit: 'per 4.375oz can', link: 'https://www.walmart.com/search?q=sardines', badge: 'best-value' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$11.99–15.99', unit: 'per 8-pack', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=sardines', note: 'Wild-caught in olive oil' },
    { store: 'Amazon', storeType: 'online', priceRange: '$14.99–22.99', unit: 'per 12-pack', link: 'https://www.amazon.com/s?k=wild+caught+sardines', badge: 'most-convenient' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$2.99–4.99', unit: 'per can', badge: 'highest-quality', note: 'Wild Planet or Crown Prince' },
  ],

  // ── Gut Health ───────────────────────────────────────────────────────

  'kefir': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$3.48–4.98', unit: 'per 32oz', link: 'https://www.walmart.com/search?q=kefir', badge: 'best-value' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$4.99–6.49', unit: 'per 32oz', badge: 'highest-quality', note: 'Grass-fed, organic options' },
    { store: 'Target', storeType: 'grocery', priceRange: '$3.99–5.49', unit: 'per 32oz', link: 'https://www.target.com/s?searchTerm=kefir' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$3.49–4.49', unit: 'per 32oz' },
  ],

  'sauerkraut': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$2.98–4.48', unit: 'per 16oz jar', link: 'https://www.walmart.com/search?q=raw+sauerkraut', badge: 'best-value' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$5.99–8.49', unit: 'per 16oz', badge: 'highest-quality', note: 'Raw, unpasteurized with live cultures' },
    { store: 'Amazon', storeType: 'online', priceRange: '$7.99–12.99', unit: 'per 25oz', link: 'https://www.amazon.com/s?k=raw+sauerkraut', badge: 'most-convenient' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$2.99–3.99', unit: 'per 16oz' },
  ],

  'kimchi': [
    { store: 'Costco', storeType: 'warehouse', priceRange: '$5.99–7.99', unit: 'per 28oz jar', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=kimchi', badge: 'best-value', note: 'Jongga brand — traditional recipe' },
    { store: 'Walmart', storeType: 'grocery', priceRange: '$4.48–6.48', unit: 'per 14oz', link: 'https://www.walmart.com/search?q=kimchi' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$6.99–9.49', unit: 'per 16oz', badge: 'highest-quality', note: 'Artisanal small-batch options' },
    { store: 'Amazon', storeType: 'online', priceRange: '$8.99–13.99', unit: 'per 28oz', link: 'https://www.amazon.com/s?k=kimchi', badge: 'most-convenient' },
  ],

  // ── Superfoods & Supplements ─────────────────────────────────────────

  'ashwagandha': [
    { store: 'Amazon', storeType: 'online', priceRange: '$14.99–24.99', unit: 'per 90 caps', link: 'https://www.amazon.com/s?k=ashwagandha+KSM-66', badge: 'most-convenient', note: 'Look for KSM-66 or Sensoril extract' },
    { store: 'iHerb', storeType: 'online', priceRange: '$12.99–19.99', unit: 'per 90 caps', link: 'https://www.iherb.com/search?kw=ashwagandha', badge: 'best-value' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$16.99–24.99', unit: 'per 60 caps', badge: 'highest-quality' },
    { store: 'GNC', storeType: 'specialty', priceRange: '$17.99–29.99', unit: 'per 90 caps', link: 'https://www.gnc.com/search?q=ashwagandha' },
  ],

  'creatine-mono': [
    { store: 'Amazon', storeType: 'online', priceRange: '$14.99–24.99', unit: 'per 500g', link: 'https://www.amazon.com/s?k=creatine+monohydrate+micronized', badge: 'most-convenient', note: 'Creapure or Optimum Nutrition' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$19.99–24.99', unit: 'per 1kg', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=creatine+monohydrate', badge: 'best-value', note: 'Bulk size — 200 servings' },
    { store: 'iHerb', storeType: 'online', priceRange: '$12.99–18.99', unit: 'per 500g', link: 'https://www.iherb.com/search?kw=creatine+monohydrate' },
    { store: 'GNC', storeType: 'specialty', priceRange: '$16.99–27.99', unit: 'per 500g', link: 'https://www.gnc.com/search?q=creatine+monohydrate' },
  ],

  'turmeric': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$1.28–2.48', unit: 'per root (2–3 inches)', link: 'https://www.walmart.com/search?q=fresh+turmeric+root', badge: 'best-value' },
    { store: 'Amazon', storeType: 'online', priceRange: '$12.99–19.99', unit: 'per 120 caps (curcumin)', link: 'https://www.amazon.com/s?k=turmeric+curcumin+bioperine', badge: 'most-convenient', note: 'Look for BioPerine for absorption' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$2.99–4.99', unit: 'per root', badge: 'highest-quality', note: 'Organic fresh root in produce' },
    { store: 'iHerb', storeType: 'online', priceRange: '$11.99–17.99', unit: 'per 120 caps', link: 'https://www.iherb.com/search?kw=turmeric+curcumin' },
  ],

  'dark-chocolate': [
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$1.99–3.49', unit: 'per 3.5oz bar', badge: 'best-value', note: '72% cacao or higher' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$9.99–13.99', unit: 'per 6-bar pack', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=dark+chocolate', note: 'Hu Kitchen or Alter Eco organic' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$3.99–5.99', unit: 'per bar', badge: 'highest-quality', note: 'Single-origin, 85%+ cacao' },
    { store: 'Amazon', storeType: 'online', priceRange: '$14.99–22.99', unit: 'per 12-pack', link: 'https://www.amazon.com/s?k=dark+chocolate+85+cacao', badge: 'most-convenient' },
  ],

  'tart-cherry-juice': [
    { store: 'Amazon', storeType: 'online', priceRange: '$19.99–29.99', unit: 'per 32oz concentrate', link: 'https://www.amazon.com/s?k=tart+cherry+juice+concentrate', badge: 'most-convenient', note: 'Montmorency — Subscribe & Save' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$9.99–13.99', unit: 'per 32oz bottle', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=tart+cherry+juice', badge: 'best-value' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$7.99–10.99', unit: 'per 32oz', badge: 'highest-quality', note: '100% juice, not from concentrate' },
    { store: 'Walmart', storeType: 'grocery', priceRange: '$5.98–8.48', unit: 'per 32oz', link: 'https://www.walmart.com/search?q=tart+cherry+juice' },
  ],

  'green-tea': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$3.48–5.48', unit: 'per 100 bags', link: 'https://www.walmart.com/search?q=green+tea', badge: 'best-value' },
    { store: 'Amazon', storeType: 'online', priceRange: '$8.99–19.99', unit: 'per 100 bags', link: 'https://www.amazon.com/s?k=matcha+green+tea', badge: 'most-convenient', note: 'Matcha powder for highest EGCG' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$2.99–4.49', unit: 'per 20 bags' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$5.99–14.99', unit: 'per 20 bags or matcha tin', badge: 'highest-quality', note: 'Ceremonial grade matcha available' },
  ],

  'ginger': [
    { store: 'Walmart', storeType: 'grocery', priceRange: '$2.98–4.48', unit: 'per lb', link: 'https://www.walmart.com/search?q=fresh+ginger+root', badge: 'best-value' },
    { store: 'Trader Joe\'s', storeType: 'grocery', priceRange: '$2.49–3.49', unit: 'per root' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$4.99–6.49', unit: 'per lb', badge: 'highest-quality', note: 'Organic available' },
    { store: 'Amazon', storeType: 'online', priceRange: '$9.99–14.99', unit: 'per ginger powder (1lb)', link: 'https://www.amazon.com/s?k=organic+ginger+root+powder', badge: 'most-convenient' },
  ],

  'spirulina': [
    { store: 'iHerb', storeType: 'online', priceRange: '$9.99–16.99', unit: 'per 500 tabs or 1lb powder', link: 'https://www.iherb.com/search?kw=spirulina', badge: 'best-value' },
    { store: 'Amazon', storeType: 'online', priceRange: '$12.99–22.99', unit: 'per 1lb powder', link: 'https://www.amazon.com/s?k=organic+spirulina+powder', badge: 'most-convenient' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$14.99–24.99', unit: 'per 8oz powder', badge: 'highest-quality' },
    { store: 'GNC', storeType: 'specialty', priceRange: '$12.99–19.99', unit: 'per 100 caps', link: 'https://www.gnc.com/search?q=spirulina' },
  ],

  'collagen-peptides': [
    { store: 'Amazon', storeType: 'online', priceRange: '$19.99–34.99', unit: 'per 20oz', link: 'https://www.amazon.com/s?k=collagen+peptides+grass+fed', badge: 'most-convenient', note: 'Vital Proteins or Sports Research' },
    { store: 'Costco', storeType: 'warehouse', priceRange: '$24.99–29.99', unit: 'per 24oz', link: 'https://www.costco.com/CatalogSearch?dept=All&keyword=collagen+peptides', badge: 'best-value', note: 'Vital Proteins bulk tub' },
    { store: 'Whole Foods', storeType: 'grocery', priceRange: '$24.99–34.99', unit: 'per 20oz', badge: 'highest-quality' },
    { store: 'Target', storeType: 'grocery', priceRange: '$21.99–29.99', unit: 'per 20oz', link: 'https://www.target.com/s?searchTerm=collagen+peptides' },
  ],
};

/** Helper: get the lowest price string from a food's purchase options */
export function getPriceSummary(foodId: string): string | null {
  const options = purchaseOptions[foodId];
  if (!options || options.length === 0) return null;
  const bestValue = options.find(o => o.badge === 'best-value');
  return bestValue ? `From ${bestValue.priceRange} ${bestValue.unit}` : `From ${options[0].priceRange} ${options[0].unit}`;
}
