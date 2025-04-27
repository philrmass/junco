import { useEffect, useRef, useState } from 'preact/hooks';
import styles from './Player.module.css';

function getSongUrl(baseUrl, song) {
  if (!song?.path) return null;

  return `${baseUrl}${encodeURIComponent(song.path)}`;
};

export default function Player({
  baseUrl,
  isPaused,
  song,
  onCommand,
}) {
  const [url, setUrl] = useState(null);
  const audio = useRef(null);
  const audioPaused = audio.current?.paused;

  useEffect(() => {
    setUrl(getSongUrl(baseUrl, song));
  }, [song]);

  useEffect(() => {
    if (url && (audioPaused !== isPaused)) {
      console.log('UPDATE-PLAY', !isPaused);
      isPaused ? audio.current.pause() : audio.current.play();
    }
  }, [url, audioPaused, isPaused]);

  return (
    <div className={styles.player}>
      <div className={styles.controls}>
        <button onClick={() => onCommand('setPlaying', isPaused)}>
          { isPaused ? 'Play' : 'Pause' }
        </button>
        <div>{ song?.title ?? 'No song playing' }</div>
      </div>
      <audio ref={audio} src={url} controls />
    </div>
  );
}

/*
function Player({
  song,
  volume,
  events,
  isPlaying,
  isTime,
  isVolume,
  toggleIsPlaying,
  nextSong,
  removeEvent,
  openCommands,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const player = useRef(null);

  useEffect(() => {
    if (player) {
      if (song) {
        setIsLoaded(false);
        fetch(`/songs/${encodeURIComponent(song.path)}`)
          .then((resp) => resp.blob())
          .then((songBlob) => {
            const url = URL.createObjectURL(songBlob);
            player.current.src = url;
            setIsLoaded(true);
            setTime(0);
          }).catch((error) => {
            console.error('Could not fetch song:', error.message);
          });
      } else {
        player.current.src = '';
        setIsLoaded(false);
        setTime(0);
        setDuration(0);
      }
    }
  }, [player, song]);

  useEffect(() => {
    if (player && nextSong) {
      player.current.onended = () => {
        nextSong();
      };
    }
  }, [player, nextSong]);

  useEffect(() => {
    if (player && isLoaded) {
      if (isPlaying === player.current.paused) {
        isPlaying ? player.current.play() : player.current.pause();
      }
    }
  }, [player, isLoaded, isPlaying]);

  useEffect(() => {
    if (player) {
      player.current.ondurationchange = (e) => setDuration(e.target.duration);
    }
  }, [player]);

  useEffect(() => {
    if (player) {
      player.current.volume = volume;
    }
  }, [player, volume]);

  useEffect(() => {
    function updateTime() {
      if (player && isPlaying) {
        setTime(player.current.currentTime);
      }
    }

    const interval = setInterval(() => updateTime(), 1000);
    return () => clearInterval(interval);
  }, [player, isPlaying]);

  useEffect(() => {
    if (events.length > 0) {
      let value = player.current.currentTime;
      const event = events[0];

      if (event.restart) {
        value = 0;
      } else if (event.time) {
        value += event.time;
        value = value < 0 ? 0 : value;
        value = value > duration ? duration : value;
      }

      player.current.currentTime = value;
      setTime(value);
      removeEvent();
    }
  }, [duration, events, removeEvent]);

  function buildVolumeBar() {
    const barClasses = `barBox ${isVolume ? 'current' : ''}`;
    const volumeStyle = {
      width: `${100 * volume}%`,
    };
    return (
      <div className={barClasses}>
        <div
          className='bar volume'
          style={volumeStyle}
        >
        </div>
      </div>
    );
  }

  function buildTimeBar() {
    const total = duration > 0 ? duration : 1;
    const fraction = time / total;
    const barClasses = `barBox ${isTime ? 'current' : ''}`;
    const timeStyle = { width: `${100 * fraction}%` };
    const markerStyle = {
      display: isPlaying ? 'block' : 'none',
      left: `${100 * fraction}%`,
    };
    return (
      <div className={barClasses}>
        <div
          className='bar time'
          style={timeStyle}
        >
          <div
            className='timeMarker'
            style={markerStyle}
          >
          </div>
        </div>
      </div>
    );
  }

  function buildPlayButton() {
    if (!song) {
      return null;
    }

    const color = getComputedStyle(document.body).getPropertyValue('--text-light');
    const pause = (<path d='M5 5 L5 95 L33 95 L33 5 L 5 5 M62 5 L62 95 L95 95 L95 5 L62 5' fill={color} />);
    const play = (<polygon points='5,95 95,50 5,5' fill={color}/>);
    const icon = isPlaying ? pause : play;
    return (
      <button
        className='playButton'
      >
        <svg width='100%' height='100%' viewBox='0 0 100 100'>
          {icon}
        </svg>
      </button>
    );
  }

  function buildArtist() {
    return (
      <span className='playArtist'>
        {song ? song.artist : ' '}
      </span>
    );
  }

  function buildSong() {
    return (
      <span className='playSong'>
        {song ? song.title : ' '}
      </span>
    );
  }

  function buildTime(value) {
    if (!song) {
      return null;
    }

    const total = Math.floor(value);
    const min = Math.floor(total / 60);
    const sec = total - (60 * min);
    const secString = `0${sec}`.slice(-2);
    const str = `${min}:${secString}`;

    return (
      <div className='playTime'>
        {str}
      </div>
    );
  }

  function buildInfoButton() {
    return <button onClick={openCommands} className='commandsButton' >? </button>;
  }

  return (
    <section className='player'>
      {buildVolumeBar()}
      <div className='playControls' onClick={toggleIsPlaying}>
        {buildPlayButton()}
        {buildTime(time)}
        <div className='nowPlaying'>
          {buildArtist()}
          {buildSong()}
        </div>
        {buildTime(duration)}
        {buildInfoButton()}
      </div>
      {buildTimeBar()}
      <audio ref={player}/>
    </section>
  );
}

Player.propTypes = {
  song: PropTypes.object,
  volume: PropTypes.number.isRequired,
  events: PropTypes.arrayOf(PropTypes.object),
  isPlaying: PropTypes.bool.isRequired,
  isTime: PropTypes.bool.isRequired,
  isVolume: PropTypes.bool.isRequired,
  toggleIsPlaying: PropTypes.func.isRequired,
  nextSong: PropTypes.func.isRequired,
  removeEvent: PropTypes.func.isRequired,
  openCommands: PropTypes.func.isRequired,
};

export default Player;
*/
