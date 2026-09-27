import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArchiveHeader from './components/ArchiveHeader';
import Homepage from './pages/Homepage';
import LandscapeHomepage from './pages/LandscapeHomepage';
import { MarbleSeriesPage, MarbleArtworkPage } from './pages/MarbleArchive';
import ArchiveMapLab from './pages/ArchiveMapLab';
import Archive from './pages/Archive';
import SeriesPage from './pages/SeriesPage';
import ArtworkDetail from './pages/ArtworkDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="app-container">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <ArchiveHeader />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/homepage-2" element={<LandscapeHomepage />} />
          <Route path="/homepage-2/series-i" element={<MarbleSeriesPage seriesId="series-i" />} />
          <Route path="/homepage-2/series-ii" element={<MarbleSeriesPage seriesId="series-ii" />} />
          <Route path="/homepage-2/artwork/:id" element={<MarbleArtworkPage />} />
          <Route path="/lab/archive-map" element={<ArchiveMapLab />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/archive/series-i" element={<SeriesPage seriesId="series-i" />} />
          <Route path="/archive/series-ii" element={<SeriesPage seriesId="series-ii" />} />
          <Route path="/archive/:id" element={<ArtworkDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

