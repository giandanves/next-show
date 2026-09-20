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
        <label className="checkboxLabel">
          <input
            {...field}
            {...props}
            type="checkbox"
            checked={Boolean(field.value)}
            disabled={isSubmitting}
            ref={ref}
          />
          <span>{label}</span>
        </label>

        <ErrorMessage name={name}>
          {(msg) => (
            <div role="alert" style={{color: "red"}}>
              {msg}
            </div>
          )}
        </ErrorMessage>

        <style jsx>{`
          .checkboxLabel {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            gap: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
          }
          input {
            margin-top: 0.2rem;
            flex-shrink: 0;
          }
        `}</style>
      </div>
    )
  },
)

LabeledCheckbox.displayName = "LabeledCheckbox"

export default LabeledCheckbox
