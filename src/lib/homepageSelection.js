const FALLBACK_SELECTED_IDS = Object.freeze([
  'VL-A-007',
  'VL-A-018',
  'VL-B-002',
  'VL-B-006',
  'VL-B-011',
  'VL-B-010',
]);

let homepageSelection = {
  desktop: FALLBACK_SELECTED_IDS,
  mobile: FALLBACK_SELECTED_IDS,
  source: 'local-fallback',
};

function visibleUniqueIds(ids, publicArtworkIds) {
  const publicIds = new Set(publicArtworkIds);
  return [...new Set((ids || []).filter((id) => typeof id === 'string' && publicIds.has(id)))];
}

export function configureHomepageSelection({ desktopArtworkIds, mobileArtworkIds, publicArtworkIds }) {
  const fallback = visibleUniqueIds(FALLBACK_SELECTED_IDS, publicArtworkIds);
  const desktop = visibleUniqueIds(desktopArtworkIds, publicArtworkIds);
  const mobile = visibleUniqueIds(mobileArtworkIds, publicArtworkIds);
  homepageSelection = {
    desktop: desktop.length === 6 ? desktop : fallback,
    mobile: mobile.length >= 4 ? mobile.slice(0, 12) : fallback,
    source: desktop.length === 6 || mobile.length >= 4 ? 'sanity' : 'local-fallback',
  };
  return homepageSelection;
}

export function getHomepageArtworkIds(view = 'desktop') {
  return homepageSelection[view] || homepageSelection.desktop;
}

export function getHomepageSelectionSource() {
  return homepageSelection.source;
}

export { FALLBACK_SELECTED_IDS };
