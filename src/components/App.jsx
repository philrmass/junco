import { useEffect, useState } from 'preact/hooks';
import preactLogo from '../assets/preact.svg';
import appLogo from '/favicon.svg';
import Library from './Library';
import Queue from './Queue';
import styles from './App.module.css';

const port = 7777;

async function getArtists(host) {
  try {
    const url = `http://${host}:${port}/artists`;
    const response = await fetch(url);
    return await response.json();
  } catch (e) {
    console.log(`Error fetching artists: ${e}`);
    return [];
  }
}

function getSongUrl(song, host) {
  if (!song?.path) return null;

  return `http://${host}:${port}/files/${encodeURIComponent(song.path)}`;
};

// ??? Player
// ??? play next song in queue if playing
// ??? play automatically
// ??? next button
// ??? calc queue index
// ??? Tabs
// ??? toast for song & album add
// ??? add search as overlay button, bottom right
// ??? player component
// ??? overflow shadows

export function App() {
  // ??? local storage host
  // const host = '192.168.1.2';
  const host = 'localhost';
  const [artists, setArtists] = useState([]);
  const [artistGuid, setArtistGuid] = useState(null);
  const [albumGuid, setAlbumGuid] = useState(null);
  const [queue, setQueue] = useState([]);
  const [song, setSong] = useState(null);
  const [url, setUrl] = useState(null);
  // const [playing, setPlaying] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const queueIndex = queue.findIndex((s) => s.guid === song?.guid);
  // const url = Boolean(song) ? getSongUrl(song, host) : 'bad';
  // console.log('URL', url);

  useEffect(() => {
    (async () => setArtists(await getArtists(host)))();
  }, [host]);

  useEffect(() => {
    setUrl(getSongUrl(song, host));
  }, [song]);

  const handleCommand = (command, param0) => {
    // ??? console.log('CMD', command, param0);

    switch(command) {
      case 'addAlbum': {
        const songs = param0.songs ?? [];
        setQueue((last) => [...last, ...songs]);
        setSong(songs[0]);
        break;
      }
      case 'addSong': {
        setQueue((last) => [...last, param0]);
        setSong(param0);
        break;
      }
      case 'toggleArtistIndex':
        setArtistGuid((last) => param0 == last ? null : param0);
        break;
      case 'toggleAlbumIndex':
        setAlbumGuid((last) => param0 == last ? null : param0);
        break;
    }
  };

  // console.log('GUIDS', artistGuid?.slice(-4), albumGuid?.slice(-4));
  return (
    <div className={styles.page}>
      <div className={styles.top}>
        { showQueue && (
          <Queue
            queue={queue}
            queueIndex={queueIndex}
            onCommand={handleCommand}
          />
        ) }
        { !showQueue && (
          <Library
            artistGuid={artistGuid}
            artists={artists}
            albumGuid={albumGuid}
            onCommand={handleCommand}
          />
        ) }
      </div>
      <div className={styles.tabs}>
        <div className={styles.tab} onClick={() => setShowQueue(false)}>
          <div>Library</div>
          <div>Artists, Albums, Songs</div>
        </div>
        <div className={styles.tab} onClick={() => setShowQueue(true)}>
          <div>Queue</div>
          <div>X Songs, H:M:S</div>
        </div>
      </div>
      <div className={styles.player}>
        <audio src={url} controls />
        <div>
          { song?.title ?? 'No song playing' }
        </div>
      </div>
    </div>
  );
}
