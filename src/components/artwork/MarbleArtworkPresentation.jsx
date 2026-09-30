import ResponsiveArtworkImage from './ResponsiveArtworkImage';

// This is the approved Artwork Record presentation path from the pre-gallery
// implementation. Keep its scene, paper treatment, and landscape artwork
// classes separate from the clean canonical media frame.
export default function MarbleArtworkPresentation({ artwork, priority = false }) {
  return <>
    <img className="marble-record-backdrop" src="/homepage-2/mobile-marble-podium-v1.png" alt="" />
    <div className="marble-record-sheet landscape-artwork-sheet">
      <ResponsiveArtworkImage
        artwork={artwork}
        className="landscape-artwork-image"
        sizes="(max-width:800px) 70vw, 36vw"
        priority={priority}
      />
    </div>
  </>;
}
