import { IMaskInput } from "react-imask";

export function CardCVC({
  onChange,
  onBlur,
  disabled,
  placeholder,
  value,
}: {
  onChange: (v: string) => void;
  onBlur?: () => void;
  disabled: boolean;
  placeholder?: string;
  value: string;
}) {
  return (
    <IMaskInput
      unmask
      value={value}
      id="cvc"
      name="cvc"
      type="text"
      mask="0000"
      disabled={disabled}
      onAccept={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      pattern="[0-9]*"
      autoComplete="billing cc-cvc"
    />
  );
}
