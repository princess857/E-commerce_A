import accessories from './accessories.js';
import bags from './bags.js';
import beauty from './beauty.js';
import fashion from './fashion.js';
import gadgets from './gadgets.js';
import hairs from './hairs.js';
import homeAppliances from './home-appliances.js';
import homeDecor from './home-decor.js';
import mensApparel from './mens-apparel.js';
import sneakers from './sneakers.js';
import watches from './watches.js';
import womenApparel from './women-apparel.js';

export const catalog = {
  accessories,
  bags,
  beauty,
  fashion,
  gadgets,
  hairs,
  'home-appliances': homeAppliances,
  'home-decor': homeDecor,
  'mens-apparel': mensApparel,
  sneakers,
  watches,
  'women-apparel': womenApparel,
};

export const CATEGORY_LABELS = {
  accessories: 'Accessories',
  bags: 'Bags',
  beauty: 'Beauty',
  fashion: 'Fashion',
  gadgets: 'Gadgets',
  hairs: 'Hairs',
  'home-appliances': 'Home Appliances',
  'home-decor': 'Home Decor',
  'mens-apparel': "Men's Apparel",
  sneakers: 'Sneakers',
  watches: 'Watches',
  'women-apparel': "Women's Apparel",
};

export function getCatalogEntry(category, index) {
  const entries = catalog[category];
  if (!entries || entries.length === 0) return null;
  return entries[index % entries.length];
}

export function getCatalogEntries(category) {
  return catalog[category] ?? [];
}
