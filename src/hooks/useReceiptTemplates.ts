import { useState, useEffect, useCallback } from 'react';
import {
  isSupabaseConfigured,
  fetchSupabaseReceiptTemplates,
  saveSupabaseReceiptTemplate,
  deleteSupabaseReceiptTemplate,
  setActiveSupabaseReceiptTemplate,
} from '@/lib/supabaseReceiptTemplates';

export interface ReceiptTemplate {
  id: string;
  name: string;
  // Header
  shopName: string;
  tagline: string;
  logo: string;
  // Address
  addressLine1: string;
  addressLine2: string;
  phone: string;
  // Footer
  footerMessage: string;
  footerSubMessage: string;
  socialMedia: string;
  socialRating: string;
  // Visibility toggles
  showLogo: boolean;
  showTagline: boolean;
  showAddress: boolean;
  showCustomerDetails: boolean;
  showCashier: boolean;
  showFooter: boolean;
  showSocialMedia: boolean;
  // Style
  fontSize: 'small' | 'medium' | 'large';
  headerStyle: 'classic' | 'modern' | 'minimal';
  // Meta
  isBuiltIn: boolean;
  createdAt: string;
  updatedAt: string;
}

const TEMPLATES_KEY = 'receiptTemplates';
const ACTIVE_KEY = 'activeReceiptTemplate';

const defaultShopData = {
  shopName: "HADIR'S CAFE",
  tagline: '"Love at First Sip"',
  logo: '/logo.jpg',
  addressLine1: 'No.8/117, Sudha Residency, Metro Nagar 4th Avenue',
  addressLine2: 'Alapakkam, Chennai, Tamil Nadu 600116',
  phone: '+91 99418 39385',
  footerMessage: "Thank you for visiting Hadir's Cafe!",
  footerSubMessage: 'We hope to see you again soon',
  socialMedia: 'Follow us on social media @hadirscafe',
  socialRating: '★ Rate us on Google & Zomato ★',
};

const builtInTemplates: ReceiptTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    ...defaultShopData,
    showLogo: true,
    showTagline: true,
    showAddress: true,
    showCustomerDetails: true,
    showCashier: true,
    showFooter: true,
    showSocialMedia: true,
    fontSize: 'medium',
    headerStyle: 'classic',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    ...defaultShopData,
    showLogo: true,
    showTagline: false,
    showAddress: false,
    showCustomerDetails: true,
    showCashier: true,
    showFooter: true,
    showSocialMedia: false,
    fontSize: 'small',
    headerStyle: 'modern',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'compact-thermal',
    name: 'Compact Thermal',
    ...defaultShopData,
    showLogo: false,
    showTagline: false,
    showAddress: true,
    showCustomerDetails: false,
    showCashier: true,
    showFooter: true,
    showSocialMedia: false,
    fontSize: 'small',
    headerStyle: 'minimal',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function loadTemplates(): ReceiptTemplate[] {
  try {
    const stored = localStorage.getItem(TEMPLATES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ReceiptTemplate[];
      const ids = new Set(parsed.map((t) => t.id));
      const merged = [...parsed];
      for (const bt of builtInTemplates) {
        if (!ids.has(bt.id)) {
          merged.push(bt);
        }
      }
      return merged;
    }
  } catch {
    // ignore parse errors
  }
  return [...builtInTemplates];
}

function loadActiveId(): string {
  return localStorage.getItem(ACTIVE_KEY) || 'classic';
}

export function useReceiptTemplates() {
  const [templates, setTemplates] = useState<ReceiptTemplate[]>(loadTemplates);
  const [activeId, setActiveIdState] = useState<string>(loadActiveId);

  // Sync with Supabase on mount if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchSupabaseReceiptTemplates().then((res) => {
      if (res && res.templates.length > 0) {
        setTemplates(res.templates);
        if (res.activeId) {
          setActiveIdState(res.activeId);
        }
      }
    });
  }, []);

  // Persist templates to localStorage
  useEffect(() => {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  }, [templates]);

  // Persist active ID to localStorage
  useEffect(() => {
    localStorage.setItem(ACTIVE_KEY, activeId);
  }, [activeId]);

  const getActiveTemplate = useCallback((): ReceiptTemplate => {
    const found = templates.find((t) => t.id === activeId);
    return found || templates[0] || builtInTemplates[0];
  }, [templates, activeId]);

  const setActiveTemplate = useCallback((id: string) => {
    setActiveIdState(id);
    if (isSupabaseConfigured) {
      setActiveSupabaseReceiptTemplate(id);
    }
  }, []);

  const saveTemplate = useCallback((template: ReceiptTemplate) => {
    const updated = { ...template, updatedAt: new Date().toISOString() };
    setTemplates((prev) => {
      const idx = prev.findIndex((t) => t.id === template.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [...prev, { ...updated, createdAt: new Date().toISOString() }];
    });

    if (isSupabaseConfigured) {
      saveSupabaseReceiptTemplate(updated, template.id === activeId);
    }
  }, [activeId]);

  const deleteTemplate = useCallback(
    (id: string) => {
      const tpl = templates.find((t) => t.id === id);
      if (tpl?.isBuiltIn) return false;

      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (activeId === id) {
        setActiveIdState('classic');
        if (isSupabaseConfigured) {
          setActiveSupabaseReceiptTemplate('classic');
        }
      }

      if (isSupabaseConfigured) {
        deleteSupabaseReceiptTemplate(id);
      }
      return true;
    },
    [templates, activeId]
  );

  const duplicateTemplate = useCallback(
    (id: string) => {
      const source = templates.find((t) => t.id === id);
      if (!source) return null;

      const newId = `custom-${Date.now()}`;
      const duplicate: ReceiptTemplate = {
        ...source,
        id: newId,
        name: `${source.name} (Copy)`,
        isBuiltIn: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTemplates((prev) => [...prev, duplicate]);

      if (isSupabaseConfigured) {
        saveSupabaseReceiptTemplate(duplicate, false);
      }
      return duplicate;
    },
    [templates]
  );

  const createBlankTemplate = useCallback(() => {
    const newId = `custom-${Date.now()}`;
    const blank: ReceiptTemplate = {
      id: newId,
      name: 'New Template',
      ...defaultShopData,
      showLogo: true,
      showTagline: true,
      showAddress: true,
      showCustomerDetails: true,
      showCashier: true,
      showFooter: true,
      showSocialMedia: true,
      fontSize: 'medium',
      headerStyle: 'classic',
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates((prev) => [...prev, blank]);

    if (isSupabaseConfigured) {
      saveSupabaseReceiptTemplate(blank, false);
    }
    return blank;
  }, []);

  return {
    templates,
    activeId,
    getActiveTemplate,
    setActiveTemplate,
    saveTemplate,
    deleteTemplate,
    duplicateTemplate,
    createBlankTemplate,
  };
}

export function getActiveReceiptTemplate(): ReceiptTemplate {
  const templates = loadTemplates();
  const activeId = loadActiveId();
  return templates.find((t) => t.id === activeId) || templates[0] || builtInTemplates[0];
}
