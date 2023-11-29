import IMask from "imask";
import { IMaskInput } from "react-imask";
import { CardDetailsForm } from ".";

export function CardExpiry({
  onChange,
  onBlur,
  disabled,
  placeholder,
  value,
}: {
  onChange: (value: CardDetailsForm["expiry"]) => void;
  onBlur?: () => void;
  disabled: boolean;
  placeholder?: string;
  value: string;
}) {
  return (
    <IMaskInput
      unmask
      value={value}
      type="text"
      id="expiry"
      name="expiry"
      mask="MM / YY"
      disabled={disabled}
      onBlur={onBlur}
      onAccept={onChange}
      placeholder={placeholder}
      blocks={EXPIRY_BLOCKS}
      pattern="[0-9]*"
      autoComplete="billing cc-exp"
    />
  );
}

const EXPIRY_BLOCKS = {
  MM: {
    mask: IMask.MaskedRange,
    placeholderChar: "MM",
    from: 1,
    to: 12,
    maxLength: 2,
  },
  YY: {
    mask: IMask.MaskedRange,
    placeholderChar: "YY",
    from: 0,
    to: 99,
    maxLength: 2,
  },
};
