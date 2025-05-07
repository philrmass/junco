import styles from './Library.module.css';

export default function Library({
  albumGuid,
  artists,
  artistGuid,
  onCommand,
}) {
  const handleAdd = (e, type, guid) => {
    e.stopPropagation();
    onCommand(type, guid);
  };

  return (
    <div className={styles.main}>
      <div className="top-shadow" />
      <div className={styles.library}>
        { artists.map((artist) => (
          <>
            <div
              className={styles.artist}
              onClick={() => onCommand('toggleArtistIndex', artist.guid)}
            >
              { artist.name }
            </div>
            { artist.guid === artistGuid && (
              <div>
                { artist.albums.map((album) => (
                  <>
                    <div
                      className={styles.album}
                      onClick={() => onCommand('toggleAlbumIndex', album.guid)}
                    >
                      <button onClick={(e) => handleAdd(e, 'addAlbum', album)}>
                        +
                      </button>
                      { album.title }
                    </div>
                    { album.guid === albumGuid && (
                      <div>
                        { album.songs.map((song) => (
                          <div
                            className={styles.song}
                            onClick={(e) => handleAdd(e, 'addSong', song)}
                          >
                            { song.title }
                          </div>
                        )) }
                      </div>
                    ) }
                  </>
                )) }
              </div>
            ) }
          </>
        )) }
      </div>
      <div className="bottom-shadow" />
    </div>
  );
}
