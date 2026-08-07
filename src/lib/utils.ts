/**
 * Utility functions for formatting currency in Nigerian Naira.
 * Internal amounts are stored in kobo. Display in ₦.
 */

export function formatNaira(amountInKobo: number): string {
  const naira = amountInKobo / 100;
  return `₦${naira.toLocaleString('en-NG')}`;
}

export function koboToNaira(amountInKobo: number): number {
  return amountInKobo / 100;
}

export function nairaToKobo(amountInNaira: number): number {
  return Math.round(amountInNaira * 100);
}

export function calculateDiscountPrice(price: number, discountPercent: number): number {
  if (discountPercent <= 0) return price;
  return Math.round(price * (1 - discountPercent / 100));
}

export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SH-${datePart}-${randomPart}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export const DELIVERY_FEE = 150000; // ₦1,500 in kobo (fixed delivery fee)
