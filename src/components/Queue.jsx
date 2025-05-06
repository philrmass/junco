import styles from './Queue.module.css';

export default function Queue({
  queue,
  queueIndex,
  onCommand,
}) {
  return (
    <div className={styles.main}>
      <div className={`shadows ${styles.queue}`}>
        { queue.map((song, index) => (
          <div className={`${styles.entry} ${index === queueIndex ? styles.selected : ''}`}>
            <div className={styles.song}>
              { song.title }
            </div>
            <div className={styles.artist}>
              { `${song.artist} / ${song.album}` }
            </div>
          </div>
        )) }
        { queue.length === 0 && (
          <div>No songs in queue</div>
        ) }
      </div>
    </div>
  );
}
