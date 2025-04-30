import { getTime } from '../utilities/time';
import styles from './Tabs.module.css';

function calcCounts(artists) {
  return artists.reduce((all, artist) => {
    const songs = artist.albums.reduce((cnt, album) => cnt + album.songs.length, 0);

    return {
      ...all,
      album: all.album + artist.albums.length,
      song: all.song + songs,
    };
  }, {
    artist: artists.length,
    album: 0,
    song: 0,
  });
}

function renderTab(title, details, isSelected, onClick) {
  const classes = `${styles.tab} ${isSelected ? styles.selected : ''}`;

  return (
    <div className={classes} onClick={onClick}>
      <div className={styles.title}>
        { title }
      </div>
      <div className={styles.details}>
        { details }
      </div>
    </div>
  );
}

export default function Tabs({
  artists,
  queue,
  showQueue,
  onShowQueue,
}) {
  const counts = calcCounts(artists);
  const duration = queue.reduce((sum, { duration }) => sum + duration, 0);
  const time = getTime(duration);

  return (
    <div className={styles.tabs}>
      { renderTab(
        'Library',
        `${counts.artist} artists, ${counts.song} songs`,
        !showQueue,
        () => onShowQueue(false),
      ) }
      { renderTab(
        'Queue',
        `${queue.length} songs, ${time}`,
        showQueue,
        () => onShowQueue(true),
      ) }
    </div>
  );
}
