export interface SupabaseMenuItem {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  isPopular?: boolean;
  isAvailable?: boolean;
}

export interface SupabaseMenuCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  itemCount?: number;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const MENU_TABLE_NAME = 'menu_items';
const CATEGORY_TABLE_NAME = 'menu_categories';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function assertSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is required. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
  }
}

function headers() {
  assertSupabaseConfigured();

  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  };
}

function toSupabaseRow(item: SupabaseMenuItem, index: number) {
  return {
    id: item.id || item._id || `item-${Date.now()}-${index}`,
    name: item.name,
    price: Number(item.price) || 0,
    category: item.category,
    image: typeof item.image === 'string' && item.image.startsWith('data:') ? '' : item.image || '',
    description: item.description || '',
    is_popular: Boolean(item.isPopular),
    is_available: item.isAvailable !== false,
    sort_order: index,
  };
}

function fromSupabaseRow(row: any): SupabaseMenuItem {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price) || 0,
    category: row.category,
    image: row.image || '',
    description: row.description || '',
    isPopular: Boolean(row.is_popular),
    isAvailable: row.is_available !== false,
  };
}

function toCategoryRow(category: SupabaseMenuCategory, index: number) {
  return {
    id: category.id,
    name: category.name,
    icon: category.icon || 'salad',
    color: category.color || 'bg-green-600 text-white',
    sort_order: index,
  };
}

function fromCategoryRow(row: any): SupabaseMenuCategory {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon || 'salad',
    color: row.color || 'bg-green-600 text-white',
  };
}

export async function getSupabaseMenuItems(): Promise<SupabaseMenuItem[]> {
  assertSupabaseConfigured();

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${MENU_TABLE_NAME}?select=*&order=sort_order.asc`, {
    headers: headers(),
  });

  if (!response.ok) {
    throw new Error(`Supabase menu load failed: ${response.status} ${response.statusText}`);
  }

  const rows = await response.json();
  return Array.isArray(rows) ? rows.map(fromSupabaseRow) : [];
}

export async function saveSupabaseMenuItems(items: SupabaseMenuItem[]) {
  assertSupabaseConfigured();

  const rows = items.map(toSupabaseRow);
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${MENU_TABLE_NAME}?on_conflict=id`, {
    method: 'POST',
    headers: {
      ...headers(),
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    throw new Error(`Supabase menu save failed: ${response.status} ${response.statusText}`);
  }
}

export async function getSupabaseMenuCategories(): Promise<SupabaseMenuCategory[]> {
  assertSupabaseConfigured();

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${CATEGORY_TABLE_NAME}?select=*&order=sort_order.asc`, {
    headers: headers(),
  });

  if (!response.ok) {
    throw new Error(`Supabase category load failed: ${response.status} ${response.statusText}`);
  }

  const rows = await response.json();
  return Array.isArray(rows) ? rows.map(fromCategoryRow) : [];
}

export async function saveSupabaseMenuCategories(categories: SupabaseMenuCategory[]) {
  assertSupabaseConfigured();

  const rows = categories.map(toCategoryRow);
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${CATEGORY_TABLE_NAME}?on_conflict=id`, {
    method: 'POST',
    headers: {
      ...headers(),
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    throw new Error(`Supabase category save failed: ${response.status} ${response.statusText}`);
  }
}
