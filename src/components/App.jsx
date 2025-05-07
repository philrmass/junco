import { useEffect, useState } from 'preact/hooks';
import { useLocalStorage } from 'utilities/hooks';
import { getIconSvgs } from '../utilities/icon';
import preactLogo from '../assets/preact.svg';
import appLogo from '/favicon.svg';
import Library from './Library';
import Player from './Player';
import Queue from './Queue';
import Tabs from './Tabs';
import styles from './App.module.css';

const port = 7777;

const icons = [
  'caretDown',
  'caretUp',
  'cross',
  'next',
  'pause',
  'play',
  'plus',
  'previous',
  // 'search',
];

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

// ??? fix queue index with repeated songs
// ??? song remove in queue
// ??? local storage for queue
// ??? click to play if not playing
// ??? add server and deploy, 3333
// ??? only play on add if not playing

// ??? scroll into view when queue shown
// ??? drag and drop songs in queue
// ??? add search as overlay button, bottom right
// ??? clear queue, bottom right, ghostbusters icon, hold for options
// ??? make time line clickable
// ??? make volume clickable
// ??? call URL.revokeObjectURL(url) on old songs
// ??? store songs in indexeddb

export function App() {
  const host = import.meta.env.DEV ? 'localhost' : '192.168.1.2';
  const [artists, setArtists] = useState([]);
  const [artistGuid, setArtistGuid] = useState(null);
  const [albumGuid, setAlbumGuid] = useState(null);
  const [queue, setQueue] = useState([]);
  const [song, setSong] = useState(null);
  const [time, setTime] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [restart, setRestart] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  // ??? check addedAt
  const queueIndex = queue.findIndex((s) => s.guid === song?.guid);
  const baseUrl = `http://${host}:${port}/files/`

  useEffect(() => {
    (async () => setArtists(await getArtists(host)))();
  }, [host]);

  const handleCommand = (command, param0) => {
    switch(command) {
      case 'addAlbum': {
        // ??? add addedAt tim songs
        const songs = param0.songs ?? [];
        setQueue((last) => [...last, ...songs]);
        // ??? only if not playing
        setSong(songs[0]);
        setIsPlaying(true);
        break;
      }
      case 'addSong': {
        // ??? add addedAt tim songs
        setQueue((last) => [...last, param0]);
        setSong(param0);
        setIsPlaying(true);
        break;
      }
      case 'next': {
        const nextSong = queue[queueIndex + 1];
        if (nextSong) {
          setSong(nextSong);
        }
        break;
      }
      case 'onEnd': {
        const nextSong = queue[queueIndex + 1];
        setSong(nextSong ?? queue[0] ?? null);
        if (!nextSong) {
          setIsPlaying(false);
        }
        break;
      }
      case 'onTime':
        setTime(param0);
        setRestart(false);
        break;
      case 'onVolume':
        setVolume(param0);
        break
      case 'previous': {
        const previousSong = queue[queueIndex - 1];

        if (!previousSong || time > 1) {
          setRestart(true);
        } else {
          setSong(previousSong);
        }
        break;
      }
      // ??? case 'removeSong':
      case 'setPlaying':
        setIsPlaying(param0);
        break;
      case 'toggleArtistIndex':
        setArtistGuid((last) => param0 == last ? null : param0);
        break;
      case 'toggleAlbumIndex':
        setAlbumGuid((last) => param0 == last ? null : param0);
        break;
    }
  };

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
      <Tabs
        artists={artists}
        queue={queue}
        showQueue={showQueue}
        onShowQueue={setShowQueue}
      />
      <Player
        baseUrl={baseUrl}
        isPaused={!isPlaying}
        restart={restart}
        song={song}
        time={time}
        volume={volume}
        onCommand={handleCommand}
      />
      <div className={styles.hidden}>
        { getIconSvgs(icons) }
      </div>
    </div>
  );
}
