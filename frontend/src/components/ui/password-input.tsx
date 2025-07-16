import * as React from "react"
import { Input } from "./input"
import { Label } from "./label"
import { ErrorMessage } from "./error-message"
import { EyeIcon, EyeOffIcon } from "./icons"

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label: string
  required?: boolean
  error?: string | string[]
  errorListLabel?: string
  id: string
  className?: string
}

function PasswordInput({
  label,
  required = false,
  error,
  errorListLabel,
  id,
  className,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          required={required}
          className={className}
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>
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

export { PasswordInput }
