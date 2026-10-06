import {VenueForm} from "../../components/VenueForm"
import {ui} from "../../ui"

export default function NewVenuePage() {
  return (
    <>
      <h1 className={ui.h1}>Nova venue</h1>
      <VenueForm mode="create" />
    </>
  )
}
