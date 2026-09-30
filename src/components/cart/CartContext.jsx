import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartContext } from './cartContextState';

const STORAGE_KEY = 'vishnu-lal-archive-cart-v1';

function loadCart() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [artworkIds, setArtworkIds] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(artworkIds)); } catch { /* Storage may be unavailable in private browsing. */ }
  }, [artworkIds]);

  const addArtwork = useCallback((artworkId) => {
    setArtworkIds((current) => current.includes(artworkId) ? current : [...current, artworkId]);
  }, []);
  const removeArtwork = useCallback((artworkId) => {
    setArtworkIds((current) => current.filter((id) => id !== artworkId));
  }, []);
  const clearCart = useCallback(() => setArtworkIds([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const includesArtwork = useCallback((artworkId) => artworkIds.includes(artworkId), [artworkIds]);

  const value = useMemo(() => ({
    artworkIds,
    addArtwork,
    removeArtwork,
    clearCart,
    includesArtwork,
    isOpen,
    openCart,
    closeCart,
  }), [artworkIds, addArtwork, removeArtwork, clearCart, includesArtwork, isOpen, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
