import { MotionLink } from '../../motion/RouteMotion';
import { useLocation } from 'react-router-dom';
import './SiteInformationLinks.css';

const links = [
  ['/contact', 'Contact'],
  ['/privacy', 'Privacy'],
  ['/terms', 'Terms'],
  ['/refund-cancellation', 'Returns'],
  ['/shipping-delivery', 'Shipping'],
];

export default function SiteInformationLinks({ className = '' }) {
  const location = useLocation();
  const onPolicyPage = links.some(([to]) => location.pathname === to);
  if (onPolicyPage && !className.includes('site-information-links--policy')) return null;

  const routeClass = location.pathname === '/'
    ? 'site-information-links--home'
    : 'site-information-links--footer';

  return <nav className={`site-information-links ${routeClass} ${className}`.trim()} aria-label="Studio information and policies">
    {links.map(([to, label]) => <MotionLink key={to} to={to} kind="portal">{label}</MotionLink>)}
  </nav>;
}
