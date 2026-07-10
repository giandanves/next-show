import {ArtistForm} from "../../components/ArtistForm"
import styles from "../../admin.module.css"

export default function NewArtistPage() {
  return (
    <>
      <h1 className={styles.h1}>Novo artista</h1>
      <ArtistForm mode="create" />
    </>
  )
}
