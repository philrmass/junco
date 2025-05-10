import Icon from '../utilities/icon';
import styles from './Queue.module.css';

export default function Queue({
  isPlaying,
  queue,
  queueIndex,
  onCommand,
}) {
  return (
    <div className={styles.main}>
      <div className="top-shadow" />
      <div className={`shadows ${styles.queue}`}>
        { queue.map((song, index) => (
          <div className={`${styles.entry} ${index === queueIndex ? styles.selected : ''}`}>
            <button
              className={styles.remove}
              onClick={() => onCommand('removeSong', index)}
            >
              <Icon name="cross" className={styles.icon} />
            </button>
            <button
              className={styles.text}
              disabled={isPlaying}
              onClick={() => onCommand('playSong', index)}
            >
              <div className={styles.song}>
                { song.title }
              </div>
              <div className={styles.artist}>
                { `${song.artist} / ${song.album}` }
              </div>
            </button>
          </div>
        )) }
        { queue.length === 0 && (
          <div>No songs in queue</div>
        ) }
      </div>
      <div className="bottom-shadow" />
      <button
        className={styles.clear}
        onClick={() => onCommand('clearQueue')}
      >
        <Icon name="menu" className={styles.icon} />
      </button>
    </div>
  );
}
