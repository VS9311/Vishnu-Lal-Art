import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getArtworkSummary } from '../../lib/artwork';
import { formatCataloguePrice, getCataloguePrice } from '../../lib/cataloguePricing';
import ResponsiveArtworkImage from '../artwork/ResponsiveArtworkImage';
import { useCart } from './cartContextState';
import { MotionLink } from '../../motion/RouteMotion';

export default function ArchiveCart() {
  const location = useLocation();
  const dialog = useRef(null);
  const trigger = useRef(null);
  const { artworkIds, removeArtwork, clearCart, isOpen, openCart, closeCart } = useCart();
  const [step, setStep] = useState('cart');
  const items = useMemo(() => artworkIds.map(getArtworkSummary).filter(Boolean), [artworkIds]);
  const total = items.reduce((sum, artwork) => sum + getCataloguePrice(artwork.id), 0);
  const inArchive = location.pathname.startsWith('/artwork/') || location.pathname.startsWith('/series-');

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (isOpen && !element.open) element.showModal();
    if (!isOpen && element.open) element.close();
  }, [isOpen]);

  useEffect(() => { if (!isOpen) setStep('cart'); }, [isOpen]);

  const close = () => {
    closeCart();
    requestAnimationFrame(() => trigger.current?.focus());
  };

  if (!inArchive) return null;

  return <>
    <button className="archive-cart-trigger" type="button" ref={trigger} onClick={openCart}>CART <span>{items.length}</span></button>
    <dialog className="archive-cart-dialog" ref={dialog} onCancel={(event) => { event.preventDefault(); close(); }} aria-labelledby="archive-cart-title">
      <button className="archive-cart-close" type="button" onClick={close}>CLOSE ×</button>
      {step === 'cart' && <div>
        <p className="marble-eyebrow">COLLECTOR CART</p>
        <h2 id="archive-cart-title">Selected works.</h2>
        {items.length ? <>
          <ul className="archive-cart-items">{items.map((artwork) => <li key={artwork.id}>
            <MotionLink to={`/artwork/${artwork.id}`} kind="focus" onClick={close} className="archive-cart-thumb"><ResponsiveArtworkImage artwork={artwork} sizes="80px" /></MotionLink>
            <div><MotionLink to={`/artwork/${artwork.id}`} kind="focus" onClick={close}>{artwork.id}</MotionLink><span>{formatCataloguePrice(getCataloguePrice(artwork.id))}</span></div>
            <button type="button" onClick={() => removeArtwork(artwork.id)}>REMOVE</button>
          </li>)}</ul>
          <div className="archive-cart-total"><span>TOTAL</span><strong>{formatCataloguePrice(total)}</strong></div>
          <button className="archive-cart-primary" type="button" onClick={() => setStep('checkout')}>PROCEED TO CHECKOUT</button>
          <button className="archive-cart-clear" type="button" onClick={clearCart}>CLEAR CART</button>
        </> : <p className="archive-cart-empty">Your cart is empty. Open an artwork record to add a work.</p>}
      </div>}
      {step === 'checkout' && <form onSubmit={(event) => { event.preventDefault(); setStep('complete'); }}>
        <button className="archive-cart-back" type="button" onClick={() => setStep('cart')}>← BACK TO CART</button>
        <p className="marble-eyebrow">PURCHASE REQUEST</p>
        <h2 id="archive-cart-title">Checkout.</h2>
        <p>{items.length} {items.length === 1 ? 'work' : 'works'} · {formatCataloguePrice(total)}</p>
        <div className="archive-cart-form">
          <label>NAME<input name="name" autoComplete="name" required /></label>
          <label>EMAIL<input name="email" type="email" autoComplete="email" required /></label>
          <label>PHONE<input name="phone" type="tel" autoComplete="tel" required /></label>
          <label>COUNTRY<input name="country" autoComplete="country-name" required /></label>
          <label className="archive-cart-wide">DELIVERY ADDRESS<textarea name="address" rows="3" autoComplete="street-address" required /></label>
          <label className="archive-cart-wide">NOTES <span>(optional)</span><textarea name="notes" rows="3" /></label>
        </div>
        <button className="archive-cart-primary" type="submit">SUBMIT PURCHASE REQUEST</button>
        <p className="archive-cart-note">No payment is taken in this prototype. Secure payment and delivery calculation will be connected before launch.</p>
      </form>}
      {step === 'complete' && <div role="status">
        <p className="marble-eyebrow">PURCHASE REQUEST</p>
        <h2 id="archive-cart-title">Request prepared.</h2>
        <p>Your selected works remain in the cart on this device. Secure delivery will be connected before the shop goes live.</p>
        <button className="archive-cart-primary" type="button" onClick={close}>RETURN TO THE ARCHIVE</button>
      </div>}
    </dialog>
  </>;
}
