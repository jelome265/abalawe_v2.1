import * as React from "react"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    _dummy?: never
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, ...props }, ref) => {
        const baseStyles = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        return (
            <label
                ref={ref}
                className={className ? `${baseStyles} ${className}` : baseStyles}
                {...props}
            />
        )
    }
)
Label.displayName = "Label"

export { Label }
