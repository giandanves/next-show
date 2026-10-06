import {VenueForm} from "../../components/VenueForm"
import styles from "../../admin.module.css"

export default function NewVenuePage() {
  return (
    <>
      <h1 className={styles.h1}>Nova venue</h1>
      <VenueForm mode="create" />
    </>
  )
}
