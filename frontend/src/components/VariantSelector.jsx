// frontend/src/components/VariantSelector.jsx
import React, { useState, useEffect } from 'react';

/**
 * Interactive color & size matrix selector
 */
const VariantSelector = ({ variants, basePrice, onSelectionChange }) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [availableSizes, setAvailableSizes] = useState([]);
  const [activeVariant, setActiveVariant] = useState(null);

  // Group variant properties to calculate size/color dependencies
  const uniqueColors = [...new Set(variants.map(v => v.colorName))];

  // Sync state transitions when selected color properties change
  useEffect(() => {
    if (selectedColor) {
      const sizesForColor = variants
        .filter(v => v.colorName === selectedColor)
        .map(v => v.size);

      setAvailableSizes(sizesForColor);

      // Reset size if the new color doesn't offer it
      if (!sizesForColor.includes(selectedSize)) {
        setSelectedSize('');
        setActiveVariant(null);
      }
    } else {
      setAvailableSizes([]);
    }
  }, [selectedColor, variants]);

  // Track the selected combination and send updates back to the parent page
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const match = variants.find(
        v => v.colorName === selectedColor && v.size === selectedSize
      );
      setActiveVariant(match || null);
      if (onSelectionChange) {
        onSelectionChange(match || null);
      }
    } else {
      setActiveVariant(null);
      if (onSelectionChange) {
        onSelectionChange(null);
      }
    }
  }, [selectedColor, selectedSize, variants, onSelectionChange]);

  const getPrice = () => {
    if (activeVariant) {
      return basePrice + activeVariant.additionalPrice;
    }
    return basePrice;
  };

  return (
    <div className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm space-y-6">
      {/* Real-time Pricing & Availability Summary */}
      <div className="flex justify-between items-baseline border-b border-gray-50 pb-4">
        <div>
          <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">Active Price</span>
          <span className="text-3xl font-extrabold text-indigo-600">₹{getPrice().toFixed(2)}</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">Inventory Stock</span>
          {activeVariant ? (
            activeVariant.stock > 0 ? (
              <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                {activeVariant.stock} Units Available
              </span>
            ) : (
              <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                Out Of Stock
              </span>
            )
          ) : (
            <span className="text-xs italic text-gray-400">Make selections below</span>
          )}
        </div>
      </div>

      {/* 1. Color Selector Grid */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-gray-700 block">
          Select Color: <span className="font-medium text-indigo-600">{selectedColor || "None selected"}</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {uniqueColors.map((colorName) => {
            const variantObj = variants.find(v => v.colorName === colorName);
            const hexColor = variantObj?.colorHex || '#FFF';
            const isSelected = selectedColor === colorName;

            return (
              <button
                key={colorName}
                onClick={() => setSelectedColor(colorName)}
                className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                  isSelected ? 'border-indigo-600 scale-110 shadow-md' : 'border-gray-200'
                }`}
                title={colorName}
                style={{ backgroundColor: hexColor }}
              >
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center text-white mix-blend-difference text-lg font-bold">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Size Selector Grid */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-gray-700 block">
          Select Size: <span className="font-medium text-indigo-600">{selectedSize || "None selected"}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((size) => {
            const isAvailable = availableSizes.includes(size);
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                disabled={!isAvailable}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 text-sm font-bold rounded-lg border transition-all ${
                  !isAvailable
                    ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                    : isSelected
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                    : 'border-gray-200 hover:border-indigo-600 bg-white text-gray-600'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
        {!selectedColor && (
          <p className="text-xs text-amber-500 italic">Please select a color first to filter available sizes.</p>
        )}
      </div>
    </div>
  );
};

export default VariantSelector;