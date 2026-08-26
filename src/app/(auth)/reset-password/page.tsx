import {Suspense} from "react"
import {ResetPasswordForm} from "../components/ResetPasswordForm"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
