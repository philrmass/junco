import styles from './Queue.module.css';

export default function Queue({
  queue,
  queueIndex,
  onCommand,
}) {
  return (
    <div className={styles.queue}>
      { queue.map((song, index) => (
        <div>
          { `${index === queueIndex ? 'X' : '_'} ${song.title}` }
        </div>
      )) }
      { queue.length === 0 && (
        <div>No songs in queue</div>
      ) }
    </div>
  );
}
