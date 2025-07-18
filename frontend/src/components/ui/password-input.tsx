import * as React from "react"
import { Input } from "./input"
import { Label } from "./label"
import { ErrorMessage } from "./error-message"
import { EyeIcon, EyeOffIcon, CheckIcon, XIcon } from "./icons"
import { cn } from "@/lib/utils"
import {
  validatePasswordRequirements,
  passwordErrorMessages,
  type PasswordRequirement
} from "@/app/lib/definitions"

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label: string
  required?: boolean
  error?: string | string[]
  errorListLabel?: string
  id: string
  className?: string
  showRequirements?: boolean
  onValidationChange?: (metRequirements: Set<PasswordRequirement>, isValid: boolean) => void
}

interface RequirementItemProps {
  text: string
  isMet: boolean
  hasError: boolean
  hasUserInput: boolean
}

function RequirementItem({ text, isMet, hasError, hasUserInput }: RequirementItemProps) {
  const getStatusStyles = () => {
    if (!hasUserInput) {
      return "text-gray-400" // Light grey initially
    }

    if (hasError && !isMet) {
      return "text-red-500" // Red when form submitted with error
    }

    if (isMet) {
      return "text-green-600" // Green when requirement is met
    }

    return "text-gray-400" // Default grey for unmet requirements
  }

  const getIcon = () => {
    if (!hasUserInput) {
      return <div className="w-2 h-2 bg-white border border-gray-300 rounded-full" /> // Hollow grey circle initially
    }

    if (isMet) {
      return <CheckIcon className="w-4 h-4 text-green-600" />
    }

    if (hasError && !isMet) {
      return <XIcon className="w-4 h-4 text-red-500" />
    }

    return <div className="w-2 h-2 bg-white border border-gray-300 rounded-full" /> // Hollow grey circle for unmet requirements
  }

  return (
    <li className={cn("flex items-center gap-2 text-xs", getStatusStyles())}>
      {getIcon()}
      <span>{text}</span>
    </li>
  )
}

function PasswordInput({
  label,
  required = false,
  error,
  errorListLabel,
  id,
  className,
  showRequirements = true,
  onValidationChange,
  onChange,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [metRequirements, setMetRequirements] = React.useState<Set<PasswordRequirement>>(new Set())
  const [hasUserInput, setHasUserInput] = React.useState(false)

  // Check if there are password validation errors
  const hasPasswordErrors = React.useMemo(() => {
    if (!error) return false
    if (Array.isArray(error)) {
      return error.some(err => (Object.values(passwordErrorMessages) as string[]).includes(err))
    }
    return (Object.values(passwordErrorMessages) as string[]).includes(error)
  }, [error])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value

    if (!hasUserInput && newPassword.length > 0) {
      setHasUserInput(true)
    }

    const newMetRequirements = validatePasswordRequirements(newPassword)
    setMetRequirements(newMetRequirements)

    const isValid = newMetRequirements.size === Object.keys(passwordErrorMessages).length
    onValidationChange?.(newMetRequirements, isValid)

    onChange?.(e)
  }

  // Determine input border styling based on validation state
  const getInputClassName = () => {
    let baseClassName = className || ""

    if (hasPasswordErrors && hasUserInput) {
      baseClassName = cn(baseClassName, "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50")
    }

    return baseClassName
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
          className={getInputClassName()}
          onChange={handlePasswordChange}
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

      {showRequirements && (
        <div className="mt-2">
          <p className="text-xs font-medium text-gray-700 mb-2">
            {errorListLabel || "Password must:"}
          </p>
          <ul className="space-y-1">
            {Object.entries(passwordErrorMessages).map(([requirement, message]) => (
              <RequirementItem
                key={requirement}
                text={message}
                isMet={metRequirements.has(requirement as PasswordRequirement)}
                hasError={hasPasswordErrors}
                hasUserInput={hasUserInput}
              />
            ))}
          </ul>
        </div>
      )}

      {error && !showRequirements && (
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
