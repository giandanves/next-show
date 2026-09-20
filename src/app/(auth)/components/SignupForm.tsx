"use client"
import {LabeledTextField} from "src/app/components/LabeledTextField"
import {LabeledCheckbox} from "src/app/components/LabeledCheckbox"
import {Form, FORM_ERROR} from "src/app/components/Form"
import signup from "../mutations/signup"
import {Signup} from "../validations"
import {useMutation} from "@blitzjs/rpc"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)

  return (
    <div>
      <h1>Create an Account</h1>

      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{
          name: "",
          email: "",
          password: "",
          passwordConfirmation: "",
          isProducer: false,
        }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            props.onSuccess?.()
            window.location.assign("/")
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              return {email: "This email is already being used"}
            }
            if (error.name === "ZodError") {
              return {[FORM_ERROR]: "Please check the form and try again."}
            }
            return {[FORM_ERROR]: error.toString()}
          }
        }}
      >
        <LabeledTextField name="name" label="Full name" placeholder="Full name" />
        <LabeledTextField name="email" label="Email" placeholder="Email" type="email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        <LabeledTextField
          name="passwordConfirmation"
          label="Confirm password"
          placeholder="Confirm password"
          type="password"
        />
        <LabeledCheckbox
          name="isProducer"
          label="I am a producer, artist, and/or I manage a venue"
        />
      </Form>
    </div>
  )
}
