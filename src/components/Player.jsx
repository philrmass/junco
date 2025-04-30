import { useEffect, useRef, useState } from 'preact/hooks';
import { getTime } from '../utilities/time';
import Icon from '../utilities/Icon';
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
      audio.current.volume = Math.min(Math.max(0, value), 1);
    }
  };

  const renderBar= (ratio) => {
    const width = `${100 * ratio}%`;

    return (
      <div className={styles.bar}>
        <div className={styles.barOn} style={{ width }}/>
      </div>
    );
  }

  const renderTitle = (song) => {
    if (song?.title) {
      return (
        <div className={styles.title}>
          { song?.title }
        </div>
      );
    }

    return <div>&nbsp;</div>
  };

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
      <div className={styles.wrap}>
        { renderTitle(song) }
      </div>
      <div className={styles.controls}>
        <button onClick={() => onCommand('previous')}>
          <Icon name="previous" className={styles.icon} />
        </button>
        <button onClick={() => onCommand('setPlaying', isPaused)}>
          <Icon name={isPaused ? "play" : 'pause'} className={styles.play} />
        </button>
        <button onClick={() => onCommand('next')}>
          <Icon name="next" className={styles.icon} />
        </button>
      </div>
      <div className={styles.barLine}>
        <button onClick={() => incVolume(-0.02)}>
          <Icon name="caretDown" className={styles.icon} />
        </button>
        { renderBar(volume) }
        <button onClick={() => incVolume(0.02)}>
          <Icon name="caretUp" className={styles.icon} />
        </button>
      </div>
      <audio ref={audio} src={url} />
    </div>
  );
}
