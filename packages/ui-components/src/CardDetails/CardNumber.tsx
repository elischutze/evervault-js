import { IMaskInput } from "react-imask";

export function CardNumber({
  autoFocus,
  disabled,
  onChange,
  onBlur,
  placeholder,
  value,
}: {
  disabled?: boolean;
  autoFocus?: boolean;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder: string;
  value: string;
}) {
  return (
    <IMaskInput
      unmask
      type="text"
      id="number"
      name="number"
      value={value}
      mask="0000 0000 0000 0000 000"
      inputMode="numeric"
      onAccept={onChange}
      onBlur={onBlur}
      autoFocus={autoFocus}
      disabled={disabled}
      placeholder={placeholder}
      pattern="[0-9]*"
      autoComplete="billing cc-number"
    />
  );
}
