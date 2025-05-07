import Icon from '../utilities/Icon';
import styles from './Queue.module.css';

export default function Queue({
  queue,
  queueIndex,
  onCommand,
}) {
  const handleRemove = (index) => {
    console.log('REM', index);
  };

  return (
    <div className={styles.main}>
      <div className="top-shadow" />
      <div className={`shadows ${styles.queue}`}>
        { queue.map((song, index) => (
          <div className={`${styles.entry} ${index === queueIndex ? styles.selected : ''}`}>
            <button onClick={(e) => handleRemove(index)}>
              <Icon name="cross" className={styles.icon} />
            </button>
            <div className={styles.text}>
              <div className={styles.song}>
                { song.title }
              </div>
              <div className={styles.artist}>
                { `${song.artist} / ${song.album}` }
              </div>
            </div>
          </div>
        )) }
        { queue.length === 0 && (
          <div>No songs in queue</div>
        ) }
      </div>
      <div className="bottom-shadow" />
    </div>
  );
}
