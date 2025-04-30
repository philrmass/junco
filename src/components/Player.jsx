import { useEffect, useRef, useState } from 'preact/hooks';
import { getTime } from '../utilities/time';
import styles from './Player.module.css';

async function loadSong(baseUrl, song) {
  if (!song?.path) return null;

  const response = await fetch(`${baseUrl}${encodeURIComponent(song.path)}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export default function Player({
  baseUrl,
  isPaused,
  restart,
  song,
  time,
  volume,
  onCommand,
}) {
  const [url, setUrl] = useState(null);
  const audio = useRef(null);
  const audioPaused = audio.current?.paused;
  const duration = song?.duration ?? 0;
  const timeRatio = duration ? time / duration : 0;

  useEffect(() => {
    (async () => {
      audio.current.pause();
      audio.current.src = null;
      setUrl(await loadSong(baseUrl, song));
    })();
  }, [baseUrl, song]);

  useEffect(() => {
    if (url && (audioPaused !== isPaused)) {
      isPaused ? audio.current.pause() : audio.current.play();
    }
  }, [url, audioPaused, isPaused]);

  useEffect(() => {
    onCommand('onVolume', audio.current?.volume ?? 0);
  }, [audio]);

  useEffect(() => {
    if (audio.current) {
      const onEnd = () => onCommand('onEnd');
      const onTime = () => onCommand('onTime', audio.current?.currentTime ?? 0);
      const onVolume = () => onCommand('onVolume', audio.current?.volume ?? 0);

      audio.current.addEventListener('ended', onEnd);
      audio.current.addEventListener('timeupdate', onTime);
      audio.current.addEventListener('volumechange', onVolume);

      return () => {
        audio.current.removeEventListener('ended', onEnd);
        audio.current.removeEventListener('timeupdate', onTime);
        audio.current.removeEventListener('volumechange', onVolume);
      };
    }
  }, [audio, onCommand]);

  useEffect(() => {
    if (restart) {
      audio.current.currentTime = 0;
    }
  }, [audio, restart]);

  const incVolume = (amount) => {
    if (audio.current) {
      const value = audio.current.volume + amount;
      console.log('VOL', value);
      audio.current.volume = Math.min(Math.max(0, value), 1);
    }
  };
  /*
  const incVolume = (amount) => {
    const volume = audio.current?.volume;

    if (typeof volume !== 'undefined')
      audio.current.volume = volume + amount;
    }
  };
  */

  const renderBar= (ratio) => {
    const width = `${100 * ratio}%`;

    return (
      <div className={styles.bar}>
        <div className={styles.barOn} style={{ width }}/>
      </div>
    );
  }

  return (
    <div className={styles.player}>
      <div className={styles.barLine}>
        <div>
          { `${getTime(time)}` }
        </div>
        { renderBar(timeRatio) }
        <div>
          { `${getTime(duration)}` }
        </div>
      </div>
      <div>{ song?.title }</div>
      <div className={styles.controls}>
        <button onClick={() => onCommand('previous')}>
          Previous
        </button>
        <button onClick={() => onCommand('setPlaying', isPaused)}>
          { isPaused ? 'Play' : 'Pause' }
        </button>
        <button onClick={() => onCommand('next')}>
          Next
        </button>
      </div>
      <div className={styles.barLine}>
        <button onClick={() => incVolume(-0.02)}>
          -
        </button>
        { renderBar(volume) }
        <button onClick={() => incVolume(0.02)}>
          +
        </button>
      </div>
      <audio ref={audio} src={url} />
    </div>
  );
}

// tesla
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
