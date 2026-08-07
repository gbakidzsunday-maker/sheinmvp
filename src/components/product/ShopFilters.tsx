'use client';

import { useState } from 'react';

interface ShopFiltersProps {
  searchParams: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

const PRICE_RANGES = [
  { label: 'Under ₦5,000', min: '0', max: '5000' },
  { label: '₦5,000 - ₦10,000', min: '5000', max: '10000' },
  { label: '₦10,000 - ₦20,000', min: '10000', max: '20000' },
  { label: '₦20,000 - ₦30,000', min: '20000', max: '30000' },
  { label: 'Above ₦30,000', min: '30000', max: '' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const COLORS = ['Black', 'White', 'Red', 'Navy', 'Blue', 'Green', 'Pink', 'Brown', 'Gold', 'Beige'];
const RATINGS = [4, 3, 2, 1];

export default function ShopFilters({ searchParams, onFilterChange, onClear }: ShopFiltersProps) {
  const hasFilters = searchParams.category || searchParams.minPrice || searchParams.maxPrice ||
    searchParams.size || searchParams.color || searchParams.rating;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Filters</h3>
        {hasFilters && (
          <button onClick={onClear} className="text-xs text-[#FF3F6C] hover:underline">
            Clear All
          </button>
        )}
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-sm mb-3">Price Range</h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => {
            const isActive = searchParams.minPrice === range.min && searchParams.maxPrice === range.max;
            return (
              <button
                key={range.label}
                onClick={() => {
                  if (isActive) {
                    onFilterChange('minPrice', '');
                    onFilterChange('maxPrice', '');
                  } else {
                    onFilterChange('minPrice', range.min);
                    onFilterChange('maxPrice', range.max);
                  }
                }}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-[#FF3F6C] text-white' : 'hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="font-semibold text-sm mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const isActive = searchParams.size === s;
            return (
              <button
                key={s}
                onClick={() => onFilterChange('size', isActive ? '' : s)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  isActive
                    ? 'bg-[#FF3F6C] text-white border-[#FF3F6C]'
                    : 'border-gray-200 hover:border-[#FF3F6C]'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="font-semibold text-sm mb-3">Color</h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => {
            const isActive = searchParams.color === c;
            return (
              <button
                key={c}
                onClick={() => onFilterChange('color', isActive ? '' : c)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  isActive
                    ? 'bg-[#FF3F6C] text-white border-[#FF3F6C]'
                    : 'border-gray-200 hover:border-[#FF3F6C]'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold text-sm mb-3">Rating</h4>
        <div className="space-y-1">
          {RATINGS.map((r) => {
            const isActive = searchParams.rating === String(r);
            return (
              <button
                key={r}
                onClick={() => onFilterChange('rating', isActive ? '' : String(r))}
                className={`flex items-center gap-2 w-full text-sm px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-[#FF3F6C] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-yellow-400">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
                <span>& up</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
