import {ArtistForm} from "../../components/ArtistForm"
import {ui} from "../../ui"

export default function NewArtistPage() {
  return (
    <>
      <h1 className={ui.h1}>Novo artista</h1>
      <ArtistForm mode="create" />
    </>
  )
}
