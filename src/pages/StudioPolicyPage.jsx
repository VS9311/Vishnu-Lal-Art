import { MotionLink } from '../motion/RouteMotion';
import SiteInformationLinks from '../components/site/SiteInformationLinks';
import './StudioPolicyPage.css';

const studio = {
  name: 'Vishnu Lal Studio',
  operator: 'Vishnu Lal',
  email: 'studio@vishnulalartist.com',
  phone: '+91 91884 37736',
  address: [
    'TC 23/3176, House No. A-39, Top Floor',
    'V. J. Lane, Lal Pura, A-39',
    'Thiruvananthapuram, Kerala 695010',
    'India',
  ],
};

const pages = {
  contact: {
    eyebrow: 'Studio information',
    title: 'Contact / Access',
    intro: 'For artwork, order, delivery, return, or private-access enquiries, contact the studio directly.',
    sections: [
      {
        title: 'The studio',
        content: <>
          <p>{studio.name} is operated by {studio.operator} as an individual artist studio in Kerala, India.</p>
          <address>{studio.address.map((line) => <span key={line}>{line}</span>)}</address>
        </>,
      },
      {
        title: 'Contact',
        content: <>
          <p><a href={`mailto:${studio.email}`}>{studio.email}</a></p>
          <p><a href="tel:+919188437736">{studio.phone}</a></p>
          <p>Website: <a href="https://vishnulalartist.com">vishnulalartist.com</a></p>
        </>,
      },
      {
        title: 'Order support',
        content: <p>Please include the artwork identifier and, for an existing order, the payment or order reference. The studio will reply by email with the relevant next steps.</p>,
      },
    ],
  },
  privacy: {
    eyebrow: 'Website policy',
    title: 'Privacy Policy',
    intro: 'This policy explains the limited personal information used by Vishnu Lal Studio when you browse the archive, make an enquiry, or purchase an artwork.',
    sections: [
      {
        title: 'Information we collect',
        content: <p>We may collect your name, email address, phone number, billing and delivery details, country, enquiry text, artwork selections, order or transaction references, and information supplied for authenticity, provenance, ownership-transfer, export, or compliance purposes. Basic technical information may also be processed to keep the website secure and functioning.</p>,
      },
      {
        title: 'How it is used',
        content: <p>Information is used to answer enquiries, process and fulfil orders, send order and dispatch updates, provide customer support, prevent fraud or misuse, administer certificates and private provenance records, assist with verified ownership transfers, maintain business records, and meet legal, tax, customs, sanctions, payment-provider, or other compliance obligations.</p>,
      },
      {
        title: 'Payments and service providers',
        content: <p>Payments may be processed by Razorpay or another payment provider presented at checkout. The studio does not store complete card details. Website hosting, content, email, analytics, delivery, and professional-service providers may process only the information needed to perform their services.</p>,
      },
      {
        title: 'Collector and provenance privacy',
        content: <p>Ownership and provenance information may be retained privately for authenticity, legal compliance, acquisition history, and ownership-transfer services. Public Archive records will normally use wording such as “Private Collection” and will not publish a collector’s identity, address, payment information, or other personal details without explicit permission, unless disclosure is legally required.</p>,
      },
      {
        title: 'Retention and your choices',
        content: <p>Personal information is retained only as long as reasonably required for the purposes above, including legal, accounting, authenticity, and provenance records. You may ask to access, correct, or delete eligible personal information by emailing the studio. Some records may need to be retained where required by law or where a continuing authenticity or provenance record has a legitimate purpose.</p>,
      },
      {
        title: 'Contact',
        content: <p>Privacy requests may be sent to <a href={`mailto:${studio.email}`}>{studio.email}</a>.</p>,
      },
    ],
  },
  terms: {
    eyebrow: 'Website policy',
    title: 'Terms & Conditions',
    intro: 'These terms apply to use of this website and to orders placed with Vishnu Lal Studio.',
    sections: [
      {
        title: 'Artwork, availability and orders',
        content: <><p>Unless specifically described otherwise, each original artwork is a unique, one-of-one physical work. During an acquisition, the Studio may record it as AVAILABLE, RESERVED, PAID, or ACQUIRED. A reservation is temporary, does not transfer ownership, and remains subject to the written reservation terms.</p><p>An order is accepted only after cleared payment is received and the Studio sends an order confirmation. If a genuine inventory conflict, duplicate payment, or technical availability error occurs, the Studio may cancel the affected transaction and refund the amount received without misrepresenting the work as available.</p></>,
      },
      {
        title: 'Presentation and accuracy',
        content: <><p>The Studio aims to present each work accurately. Screens, lighting, photography, cropping, room mock-ups, and digital presentation may affect perceived colour, scale, texture, or appearance. Interior visualisations are presentation aids and are not exact architectural or scale representations unless expressly stated. The catalogue dimensions in the artwork record are authoritative.</p><p>Works are offered unframed unless the individual artwork record or acquisition agreement states otherwise. Optional framing arranged by the Studio is a separate service or specification and may affect price, packing, insurance, delivery time, and return arrangements.</p></>,
      },
      {
        title: 'Price, payment and title',
        content: <><p>The artwork price and currency stated in the confirmed order apply. Unless expressly included in the artwork record, checkout, invoice, or signed acquisition agreement, the artwork price excludes international shipping, framing, insurance, import duties, customs-clearance costs, foreign VAT, GST or sales tax, brokerage, handling, and other destination charges. The purchaser is responsible for destination-country duties, taxes, and local customs charges unless the Studio expressly agrees otherwise.</p><p>Legal title to the physical artwork transfers only after cleared payment has been received in full and any stated conditions of sale have been satisfied. A reserved or held artwork remains owned by the artist until then. Transfer of title is separate from copyright and from the allocation of transit risk in the Shipping &amp; Delivery Policy.</p></>,
      },
      {
        title: 'Physical ownership and intellectual property',
        content: <><p>Purchase transfers ownership of the physical artwork only. Copyright, reproduction, publication, licensing, merchandising, image, adaptation, and other intellectual-property rights remain with the artist or applicable rightsholder unless expressly assigned in a separate written agreement.</p><p>Ownership of the original does not by itself permit reproduction, commercial exploitation, licensing, merchandising, tokenisation or NFT minting, creation of derivative works, or authorisation of reproductions. Private display and ordinary resale of the physical artwork remain permitted subject to applicable law and the sale agreement. Public exhibition of the physical original must respect applicable law, the artist’s moral rights, and any artwork-specific agreement. Galleries, museums, publishers, auction houses, media, and collectors should contact the Studio before making exhibition catalogues, press images, online reproductions, projections, promotional materials, or other publication uses not already permitted by law.</p></>,
      },
      {
        title: 'Artist’s moral rights and conservation',
        content: <p>To the extent provided by applicable law, the artist retains applicable moral rights, including attribution and protection against distortion, mutilation, unauthorised modification, or other treatment prejudicial to the artist’s honour or reputation. Owners are encouraged to consult the Studio before substantial restoration, conservation, mounting, cutting, fixing, varnishing, or reframing that materially alters the work. This does not prohibit reasonable professional conservation or limit rights that applicable law gives an owner.</p>,
      },
      {
        title: 'Archive identity, authenticity and provenance',
        content: <><p>Each original retains its permanent Vishnu Lal Archive catalogue ID regardless of ownership changes. A collector, reseller, gallery, or intermediary should not replace or alter that identity. Qualifying originals sold directly by the Studio will be accompanied by a Certificate of Authenticity or equivalent official documentation referencing the permanent ID.</p><p>Loss of a physical certificate does not automatically invalidate an artwork, but replacement or confirmation will be issued only after verification by Vishnu Lal Studio or the Vishnu Lal Archive. The Studio may decline to authenticate, register, or endorse a resale where provenance cannot be verified. A third-party marketplace, auction, gallery, social-media, or resale listing is not, by itself, authentication or endorsement by the Studio.</p></>,
      },
      {
        title: 'Ownership transfers and resale',
        content: <><p>Subsequent owners are strongly encouraged—and, where an applicable sale agreement requires, obliged—to register an ownership transfer with the Vishnu Lal Archive so authenticated provenance can remain continuous. A purchaser acquiring directly from the Studio agrees, to the extent legally enforceable, to notify the Studio of a later resale or transfer and provide information reasonably sufficient to update the private provenance record. This contractual obligation does not automatically bind an unrelated future purchaser where the law does not permit it.</p><p>The artist reserves every resale royalty, droit de suite, resale share, or equivalent statutory right available under the law governing a later resale. Eligibility, thresholds, rates, collection methods, and responsible parties depend on the jurisdiction. Any valid, separately agreed contractual resale payment is also preserved. The Studio may offer optional provenance-transfer, authentication, resale, or collector-relations assistance, but does not guarantee a buyer or resale price.</p></>,
      },
      {
        title: 'Condition and handmade characteristics',
        content: <p>For higher-value works, the Studio may provide a condition report or written condition confirmation before shipment. Variations inherent to handmade works, paper, charcoal, archival materials, or the artist’s process are not necessarily defects. This does not excuse undisclosed material damage or override the agreed description or mandatory consumer rights.</p>,
      },
      {
        title: 'International transactions and compliance',
        content: <><p>Sales may involve purchasers in multiple jurisdictions. International shipment may require export documents, customs declarations, cultural-property checks, courier approvals, or other legal formalities. The Studio may request information reasonably necessary for customs, export, sanctions, fraud prevention, identity or authority checks, KYC, payment-provider requirements, or other legal obligations, including confirmation that a purchaser is acting for themselves or is authorised to act for a disclosed principal.</p><p>The Studio may proportionately pause, reject, or refund a transaction, or request additional verification, where fraud, sanctions, payment abuse, identity misuse, money-laundering concerns, export restrictions, or other compliance issues are reasonably suspected. Shipment will not be promised or made where lawful export or delivery cannot be completed.</p></>,
      },
      {
        title: 'Archive information and collector privacy',
        content: <p>The Archive distinguishes verified factual information, artist statements, formal observation, and curatorial interpretation. Curatorial interpretation is not presented as a verified statement of the artist’s intention unless the artist has approved or stated it. Internal registrar notes, research, unpublished curatorial fields, and private collector information are not intended to appear automatically in public records. Public provenance normally identifies a private owner as “Private Collection” unless publication is expressly authorised or legally required.</p>,
      },
      {
        title: 'No investment representation',
        content: <p>Nothing on this website, in Archive materials, pricing, acquisition correspondence, provenance records, or Studio communications is financial or investment advice. The Studio does not guarantee appreciation, future resale value, market performance, liquidity, auction results, or investment returns.</p>,
      },
      {
        title: 'Website use',
        content: <p>You may browse the archive for personal, non-commercial purposes. You may not misuse the website, attempt unauthorised access, or reproduce artwork imagery or site content beyond what applicable law permits.</p>,
      },
      {
        title: 'Law and contact',
        content: <><p>These terms and the Studio’s contract are governed by the laws of India, and, subject to mandatory applicable law, disputes are subject to the courts of Kerala, India. Nothing in these terms excludes mandatory consumer, copyright, resale-right, tax, customs, privacy, or other statutory protections of another jurisdiction where they cannot legally be excluded.</p><p>If these general website terms conflict with a signed artwork-specific sale agreement or invoice, the signed artwork-specific document prevails for that transaction, subject to mandatory applicable law. Questions may be sent to <a href={`mailto:${studio.email}`}>{studio.email}</a>.</p></>,
      },
    ],
  },
  returns: {
    eyebrow: 'Website policy',
    title: 'Refund / Cancellation Policy',
    intro: 'Please contact the studio before returning an artwork. Original works are unique and should be handled and repacked with care.',
    sections: [
      {
        title: 'Unique original artworks',
        content: <p>Original artworks are unique, one-of-one objects rather than ordinary mass-produced goods. This policy explains the Studio’s agreed cancellation, return, and damage process without excluding any mandatory cancellation, conformity, refund, or return rights that apply in the purchaser’s jurisdiction and cannot lawfully be waived.</p>,
      },
      {
        title: 'Cancellation before dispatch',
        content: <p>You may request cancellation before the artwork is dispatched by emailing the Studio with your order reference. If dispatch has already taken place, the request will be handled as a return. A reservation or hold does not transfer title; any cancellation terms stated in an artwork-specific reservation or sale agreement also apply.</p>,
      },
      {
        title: '30-day returns',
        content: <p>A return may be requested within 30 calendar days after delivery. The artwork must be returned in its original condition, with the original protective materials and documentation. Contact the studio before sending it back so return instructions can be provided.</p>,
      },
      {
        title: 'Return costs and deductions',
        content: <p>Unless the studio sent the wrong work or accepts that it arrived damaged, the buyer is responsible for secure return packing, return shipping, customs charges, and any loss or damage during return transit. Original outbound shipping and non-refundable payment or customs charges may be excluded from the refund where permitted by law.</p>,
      },
      {
        title: 'Transit damage',
        content: <p>Please report visible or discovered transit damage as soon as reasonably possible and, where practicable, within 14 calendar days of delivery. Preserve all packaging and the shipping label; photograph the outer package, label, inner protection, and artwork; and cooperate with reasonable courier or insurance enquiries. The reporting period does not reduce any longer mandatory right that applies. The Studio will assess the evidence and confirm the available resolution. Because each work is unique, an identical replacement may not be possible.</p>,
      },
      {
        title: 'Refund timing',
        content: <p>Approved refunds will be initiated to the original payment method within 7 business days after cancellation approval or receipt and inspection of the returned artwork. Inspection is limited to confirming identity, condition, documentation, and compliance with the agreed return process and will not be used to avoid mandatory rights. The payment provider or bank may require additional processing time.</p>,
      },
    ],
  },
  shipping: {
    eyebrow: 'Website policy',
    title: 'Shipping & Delivery Policy',
    intro: 'Original artworks are prepared individually and dispatched from Thiruvananthapuram, Kerala, India.',
    sections: [
      {
        title: 'Preparation and dispatch',
        content: <p>Orders are normally prepared for dispatch within 14–20 calendar days after payment and order confirmation. The studio will send a confirmation email before dispatch and will share tracking or carrier details when available.</p>,
      },
      {
        title: 'Artwork format and packing',
        content: <p>Artworks are supplied unframed unless the artwork record or written acquisition terms state otherwise. Unframed works on paper are prepared with archival or protective materials appropriate to the sheet and destination. Optional framing is a separate agreed specification and may affect price, packing, insurance, delivery time, and return arrangements.</p>,
      },
      {
        title: 'Delivery time and charges',
        content: <p>Delivery time begins after dispatch and depends on the destination, carrier, customs, and local conditions. Any shipping charge available at checkout or in the order confirmation applies to that order. Delays caused by customs or carriers may be outside the studio’s control.</p>,
      },
      {
        title: 'International orders',
        content: <><p>Unless expressly stated otherwise, international shipping, import duties, customs-clearance charges, destination VAT, GST or sales tax, brokerage, handling, and other local charges are not included in the artwork price. The purchaser is responsible for these destination-country amounts, and they are not collected by the Studio unless expressly shown in the confirmed order.</p><p>International shipment may require an export invoice, packing list, shipping or postal export document, customs declaration, cultural-property review, courier approval, or other information. The Studio may request information reasonably required for lawful export, customs, sanctions, KYC, or payment-provider compliance and may decline or delay shipment where the required lawful export cannot be completed.</p></>,
      },
      {
        title: 'Risk, insurance and condition',
        content: <><p>Unless an artwork-specific agreement or mandatory applicable law provides otherwise, risk of loss or damage passes when the artwork is delivered to the purchaser or authorised recipient at the agreed address. If the purchaser independently appoints a carrier not offered by the Studio, risk may pass when the artwork is handed to that carrier to the extent permitted by law. This allocation does not remove mandatory consumer rights.</p><p>Shipments are not insured unless the Studio expressly agrees otherwise in writing before dispatch. A condition report or condition confirmation may be provided for higher-value works. Minor characteristics inherent to handmade paper, charcoal, archival materials, or the artist’s process are not necessarily damage, but undisclosed material damage is not excluded by this statement.</p></>,
      },
      {
        title: 'Delivery damage procedure',
        content: <p>Inspect the package promptly. If damage is visible or discovered, preserve the artwork, all packing materials, and the shipping label; photograph the artwork, outer package, label, and inner protection; notify the Studio as soon as reasonably possible and, where practicable, within 14 calendar days; and cooperate with reasonable courier or insurance enquiries. Any longer mandatory reporting or consumer right remains unaffected.</p>,
      },
      {
        title: 'Address accuracy',
        content: <p>The buyer is responsible for providing a complete and accurate delivery address and reachable contact details. Additional costs caused by an incorrect address, refused delivery, or unclaimed shipment may be charged to the buyer where permitted by law.</p>,
      },
    ],
  },
};

export default function StudioPolicyPage({ page }) {
  const policy = pages[page];

  return <main id="main-content" className="studio-policy-page">
    <header className="studio-policy-header">
      <MotionLink className="studio-policy-brand" to="/" kind="portal">VISHNU LAL </MotionLink>
      <MotionLink className="studio-policy-return" to="/" kind="portal">RETURN TO HOME →</MotionLink>
    </header>

    <article className="studio-policy-document">
      <header className="studio-policy-title-block">
        <p className="studio-policy-eyebrow">{policy.eyebrow}</p>
        <h1>{policy.title}</h1>
        <p className="studio-policy-intro">{policy.intro}</p>
        <p className="studio-policy-date">LAST UPDATED · 11 NOVEMBER 2026</p>
      </header>

      <div className="studio-policy-sections">
        {policy.sections.map((section, index) => <section key={section.title}>
          <p className="studio-policy-index">{String(index + 1).padStart(2, '0')}</p>
          <div><h2>{section.title}</h2>{section.content}</div>
        </section>)}
      </div>
    </article>

    <footer className="studio-policy-footer">
      <div><strong>{studio.name}</strong><span>{studio.address[2]}, {studio.address[3]}</span></div>
      <SiteInformationLinks className="site-information-links--policy" />
    </footer>
  </main>;
}
