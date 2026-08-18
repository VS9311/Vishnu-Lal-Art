import React from 'react';
import EntryEncounter from '../components/encounters/EntryEncounter';
import RecordEncounter from '../components/encounters/RecordEncounter';
import SilenceEncounter from '../components/encounters/SilenceEncounter';
import SelectedWorkEncounter from '../components/encounters/SelectedWorkEncounter';
import ArchivalInterruption from '../components/encounters/ArchivalInterruption';
import MultipleWorksEncounter from '../components/encounters/MultipleWorksEncounter';
import ArtistEncounter from '../components/encounters/ArtistEncounter';
import ExitEncounter from '../components/encounters/ExitEncounter';
import sequenceData from '../data/homepage-sequence.json';
import { getArtworkSummary, isPublicArtwork } from '../lib/artwork';

export default function Homepage() {
  const getArtwork = (id) => getArtworkSummary(id);
  const isPending = (id) => !isPublicArtwork(id);

  return (
    <main id="main-content" className="homepage">
      {sequenceData.map((step, index) => {
        switch (step.type) {
          case 'ENTRY':
            return <EntryEncounter key={index} artwork={getArtwork(step.artworkId)} pending={isPending(step.artworkId)} />;
          case 'RECORD':
            return <RecordEncounter key={index} artwork={getArtwork(step.artworkId)} pending={isPending(step.artworkId)} />;
          case 'SILENCE':
            return <SilenceEncounter key={index} />;
          case 'SELECTED_WORK':
            return <SelectedWorkEncounter key={index} artwork={getArtwork(step.artworkId)} pending={isPending(step.artworkId)} allowPending={step.allowPending} />;
          case 'ARCHIVAL_INTERRUPTION':
            return <ArchivalInterruption key={index} text={step.text} />;
          case 'MULTIPLE_WORKS': {
            const works = step.artworkIds.map((id) => getArtwork(id)).filter(Boolean);
            return <MultipleWorksEncounter key={index} artworks={works} allowPending={step.allowPending} />;
          }
          case 'ARTIST':
            return <ArtistEncounter key={index} text={step.text} />;
          case 'EXIT':
            return <ExitEncounter key={index} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
