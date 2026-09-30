import { BrowserRouter as Router, Navigate, Routes, Route, useParams } from 'react-router-dom';
import LandscapeHomepage from './pages/LandscapeHomepage';
import ArtistPage from './pages/ArtistPage';
import { MarbleSeriesPage, MarbleArtworkPage } from './pages/MarbleArchive';
import ArchiveCart from './components/cart/ArchiveCart';
import { CartProvider } from './components/cart/CartContext';
import { RouteMotionProvider, RouteMotionStage } from './motion/RouteMotion';

function LegacyArtworkRedirect() {
  const { id } = useParams();
  return <Navigate to={`/artwork/${id}`} replace />;
}

function App() {
  return (
    <Router>
      <CartProvider>
        <RouteMotionProvider>
          <div className="app-container">
            <a className="skip-link" href="#main-content">Skip to content</a>
            <RouteMotionStage><Routes>
            <Route path="/" element={<LandscapeHomepage />} />
            <Route path="/artist" element={<ArtistPage />} />
            <Route path="/series-i" element={<MarbleSeriesPage seriesId="series-i" />} />
            <Route path="/series-ii" element={<MarbleSeriesPage seriesId="series-ii" />} />
            <Route path="/artwork/:id" element={<MarbleArtworkPage />} />

            <Route path="/homepage-2" element={<Navigate to="/" replace />} />
            <Route path="/homepage-2/series-i" element={<Navigate to="/series-i" replace />} />
            <Route path="/homepage-2/series-ii" element={<Navigate to="/series-ii" replace />} />
            <Route path="/homepage-2/artwork/:id" element={<LegacyArtworkRedirect />} />
            <Route path="/archive/*" element={<Navigate to="/" replace />} />
            <Route path="/lab/archive-map" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes></RouteMotionStage>
            <ArchiveCart />
          </div>
        </RouteMotionProvider>
      </CartProvider>
    </Router>
  );
}

export default App;

