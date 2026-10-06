import {forwardRef, PropsWithoutRef} from "react"
import {useField, useFormikContext, ErrorMessage} from "formik"

export interface LabeledTextFieldProps extends PropsWithoutRef<React.JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<React.JSX.IntrinsicElements["div"]>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({name, label, outerProps, ...props}, ref) => {
    const [input] = useField(name)
    const {isSubmitting} = useFormikContext()

    return (
      <div {...outerProps}>
        <label className="flex flex-col items-start text-base">
          {label}
          <input
            {...input}
            disabled={isSubmitting}
            {...props}
            ref={ref}
            className="mt-2 appearance-none rounded border border-primary px-2 py-1 text-base"
          />
        </label>

        <ErrorMessage name={name}>
          {(msg) => (
            <div role="alert" className="text-sm text-red-700">
              {msg}
            </div>
          )}
        </ErrorMessage>
      </div>
    )
  },
)

LabeledTextField.displayName = "LabeledTextField"

export default LabeledTextField
