import {forwardRef, PropsWithoutRef} from "react"
import {useField, useFormikContext, ErrorMessage} from "formik"

export interface LabeledCheckboxProps
  extends Omit<PropsWithoutRef<React.JSX.IntrinsicElements["input"]>, "type" | "name"> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  outerProps?: PropsWithoutRef<React.JSX.IntrinsicElements["div"]>
}

export const LabeledCheckbox = forwardRef<HTMLInputElement, LabeledCheckboxProps>(
  ({name, label, outerProps, ...props}, ref) => {
    const [field] = useField({name, type: "checkbox"})
    const {isSubmitting} = useFormikContext()

    return (
      <div {...outerProps}>
        <label className="flex cursor-pointer items-start gap-2 text-base">
          <input
            {...field}
            {...props}
            type="checkbox"
            checked={Boolean(field.value)}
            disabled={isSubmitting}
            ref={ref}
            className="mt-0.5 shrink-0"
          />
          <span>{label}</span>
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

LabeledCheckbox.displayName = "LabeledCheckbox"

export default LabeledCheckbox
