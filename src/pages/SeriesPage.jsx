import { useParams } from 'react-router-dom';
import { getSeriesData, getSeriesArtworks, getAllSeries } from '../lib/artwork';
import ChamberSeries from '../components/series/ChamberSeries';
import SpatialSeriesPrototype from '../components/series/SpatialSeriesPrototype';
import NotFound from './NotFound';

export default function SeriesPage({ seriesId: propSeriesId }) {
  const { seriesId: paramSeriesId } = useParams();
  const series = getSeriesData(propSeriesId || paramSeriesId);

  if (!series) return <NotFound />;

  const artworks = getSeriesArtworks(series.id);
  const otherSeries = getAllSeries().find((candidate) => candidate.id !== series.id);

  if (series.id === 'series-ii') {
    return <SpatialSeriesPrototype series={series} artworks={artworks} />;
  }

  return <ChamberSeries series={series} artworks={artworks} otherSeries={otherSeries} />;
}
