import * as React from "react"
import { Input } from "./input"
import { Label } from "./label"
import { ErrorMessage } from "./error-message"

interface FormInputProps extends React.ComponentProps<"input"> {
  label: string
  required?: boolean
  error?: string | string[]
  errorListLabel?: string
}

function FormInput({
  label,
  required = false,
  error,
  errorListLabel,
  id,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Input
        id={id}
        required={required}
        className={className}
        {...props}
      />
      {error && (
        Array.isArray(error) && error.length > 0 && errorListLabel ? (
          <div>
            <p>
              <small>{errorListLabel}</small>
            </p>
            <ul>
              {error.map((errorMsg) => (
                <li key={errorMsg}>
                  <ErrorMessage>- {errorMsg}</ErrorMessage>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ErrorMessage>{Array.isArray(error) ? error.join(', ') : error}</ErrorMessage>
        )
      )}
    </div>
  )
}

export { FormInput }
