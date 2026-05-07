"use client";

import { useMemo } from 'react';
import { PRODUCT_PRICING, DIRECT_PURCHASE_PRODUCT_IDS } from '../constants';
import { ProductPricingResult } from '../types';

interface UseProductPricingProps {
    productId: string;
    purchaseType: string;
    quantity: number;
}

/**
 * Hook to calculate product pricing based on product selection
 */
export function useProductPricing({
    productId,
    purchaseType,
    quantity,
}: UseProductPricingProps): ProductPricingResult {
    return useMemo(() => {
        // Determine if this is a direct purchase
        const isDirectPurchase =
            purchaseType === "direct" ||
            DIRECT_PURCHASE_PRODUCT_IDS.includes(productId);

        let price = 0;
        let productName = "";
        let savings = "";
        let isBundle = false;

        if (productId) {
            // SINGLE PRODUCT CHECKOUT
            if (isDirectPurchase) {
                const productConfig = PRODUCT_PRICING[productId];
                if (productConfig) {
                    price = productConfig.price * quantity;
                    productName = productConfig.name;
                } else {
                    price = 65 * quantity; // Safer default for V2 shirts
                    productName = "Storefront Product";
                }
            } else {
                // Raffle entry pricing
                isBundle = quantity === 4;
                price = isBundle ? 100 : quantity * 50;
                savings = isBundle ? "Save $100!" : "";
                productName = "Gold Rush Raffle Entries";
            }
        } else {
            // CART CHECKOUT (FROM NAVBAR)
            if (typeof window !== "undefined") {
                const savedCart = localStorage.getItem("mv-cart");
                if (savedCart) {
                    const cart = JSON.parse(savedCart);
                    price = cart.reduce((acc: number, item: { price: string }) => acc + (parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0), 0);
                    productName = `${cart.length} Item(s) in Cart`;
                } else {
                    price = 0;
                    productName = "Empty Cart";
                }
            }
        }

        return {
            price,
            productName,
            savings,
            isBundle,
            isDirectPurchase,
        };
    }, [productId, purchaseType, quantity]);
}
