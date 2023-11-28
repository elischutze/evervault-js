import { useLayoutEffect, useMemo, useRef } from "react";

type FieldProps = {
  name?: string;
  error?: false | string;
  children: React.ReactNode;
};

export function Field({ name, error, children }: FieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  const isValid = useMemo(() => !error, [error]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const inputs = ref.current.querySelectorAll("input");
    inputs.forEach((input) => {
      input.setAttribute("aria-invalid", isValid ? "false" : "true");
      input.setCustomValidity(error || "");
    });
  }, [error, isValid]);

  return (
    <div
      ref={ref}
      data-name={name}
      ev-name={name}
      ev-valid={isValid ? "true" : "false"}
      aria-invalid={!isValid}
      className="field"
    >
      {children}
    </div>
  );
}
