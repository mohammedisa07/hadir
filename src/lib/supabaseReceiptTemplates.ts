import { ReceiptTemplate } from '@/hooks/useReceiptTemplates';

/**
 * SQL snippet to create receipt_templates table in Supabase SQL Editor:
 * 
 * CREATE TABLE IF NOT EXISTS receipt_templates (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   is_built_in BOOLEAN DEFAULT FALSE,
 *   header_style TEXT DEFAULT 'standard',
 *   shop_name TEXT,
 *   tagline TEXT,
 *   logo TEXT,
 *   address_line1 TEXT,
 *   address_line2 TEXT,
 *   phone TEXT,
 *   show_logo BOOLEAN DEFAULT TRUE,
 *   show_tagline BOOLEAN DEFAULT TRUE,
 *   show_address BOOLEAN DEFAULT TRUE,
 *   show_customer_details BOOLEAN DEFAULT TRUE,
 *   show_cashier BOOLEAN DEFAULT TRUE,
 *   show_footer BOOLEAN DEFAULT TRUE,
 *   show_social_media BOOLEAN DEFAULT TRUE,
 *   footer_message TEXT,
 *   footer_sub_message TEXT,
 *   social_media TEXT,
 *   social_rating TEXT,
 *   font_size TEXT DEFAULT 'medium',
 *   is_active BOOLEAN DEFAULT FALSE,
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const TEMPLATES_TABLE = 'receipt_templates';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function headers() {
  if (!isSupabaseConfigured) return null;
  return {
    apikey: SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
}

export async function fetchSupabaseReceiptTemplates(): Promise<{ templates: ReceiptTemplate[]; activeId: string } | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TEMPLATES_TABLE}?select=*`, {
      headers: headers()!,
    });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return null;

    let activeId = '';
    const templates: ReceiptTemplate[] = rows.map((row: any) => {
      if (row.is_active) activeId = row.id;
      return {
        id: row.id,
        name: row.name,
        isBuiltIn: Boolean(row.is_built_in),
        headerStyle: row.header_style || 'standard',
        shopName: row.shop_name || "HADIR'S CAFE",
        tagline: row.tagline || 'Love at First Sip',
        logo: row.logo || '/logo.jpg',
        addressLine1: row.address_line1 || '',
        addressLine2: row.address_line2 || '',
        phone: row.phone || '',
        showLogo: row.show_logo !== false,
        showTagline: row.show_tagline !== false,
        showAddress: row.show_address !== false,
        showCustomerDetails: row.show_customer_details !== false,
        showCashier: row.show_cashier !== false,
        showFooter: row.show_footer !== false,
        showSocialMedia: row.show_social_media !== false,
        footerMessage: row.footer_message || 'Thank you for visiting!',
        footerSubMessage: row.footer_sub_message || '',
        socialMedia: row.social_media || '',
        socialRating: row.social_rating || '',
        fontSize: row.font_size || 'medium',
      };
    });

    return { templates, activeId: activeId || templates[0]?.id || 'default-standard' };
  } catch (err) {
    console.warn('Failed to fetch receipt templates from Supabase:', err);
    return null;
  }
}

export async function saveSupabaseReceiptTemplate(template: ReceiptTemplate, isActive: boolean = false): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const row = {
      id: template.id,
      name: template.name,
      is_built_in: template.isBuiltIn,
      header_style: template.headerStyle,
      shop_name: template.shopName,
      tagline: template.tagline,
      logo: template.logo,
      address_line1: template.addressLine1,
      address_line2: template.addressLine2,
      phone: template.phone,
      show_logo: template.showLogo,
      show_tagline: template.showTagline,
      show_address: template.showAddress,
      show_customer_details: template.showCustomerDetails,
      show_cashier: template.showCashier,
      show_footer: template.showFooter,
      show_social_media: template.showSocialMedia,
      footer_message: template.footerMessage,
      footer_sub_message: template.footerSubMessage,
      social_media: template.socialMedia,
      social_rating: template.socialRating,
      font_size: template.fontSize,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TEMPLATES_TABLE}?on_conflict=id`, {
      method: 'POST',
      headers: {
        ...headers()!,
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(row),
    });

    return res.ok;
  } catch (err) {
    console.warn('Failed to save receipt template to Supabase:', err);
    return false;
  }
}

export async function deleteSupabaseReceiptTemplate(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TEMPLATES_TABLE}?id=eq.${id}`, {
      method: 'DELETE',
      headers: headers()!,
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to delete receipt template from Supabase:', err);
    return false;
  }
}

export async function setActiveSupabaseReceiptTemplate(activeId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    // Set target template is_active to true
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TEMPLATES_TABLE}?id=eq.${activeId}`, {
      method: 'PATCH',
      headers: headers()!,
      body: JSON.stringify({ is_active: true }),
    });

    return res.ok;
  } catch (err) {
    console.warn('Failed to set active receipt template in Supabase:', err);
    return false;
  }
}
