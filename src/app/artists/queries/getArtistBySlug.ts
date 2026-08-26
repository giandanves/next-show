import {Ctx} from "blitz"
import {fetchArtistBySlug} from "../artistPublicData"

export default async function getArtistBySlug({slug}: {slug: string}, _ctx: Ctx) {
  return fetchArtistBySlug(slug)
}
