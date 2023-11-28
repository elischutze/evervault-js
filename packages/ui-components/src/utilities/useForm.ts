import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type UseFormReturn<T> = {
  values: T;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  errors: Partial<Record<keyof T, string>> | null;
  setError: <K extends keyof T>(field: K, error: string | undefined) => void;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  validate: () => void;
  register: <K extends keyof T>(
    name: K,
  ) => {
    onChange: (value: T[K]) => void;
    onBlur: () => void;
  };
};

type Errors<T> = Partial<Record<keyof T, string>>;

type UseFormOptions<T> = {
  initialValues: T;
  validate: (values: T) => Errors<T> | null;
  onChange?: (values: UseFormReturn<T>) => void;
};

export function useForm<T extends object>({
  initialValues,
  validate,
  onChange,
}: UseFormOptions<T>): UseFormReturn<T> {
  const validationFunction = useRef(validate);
  const triggerChange = useRef(false);
  const [touched, setTouched] = useState<UseFormReturn<T>["touched"]>({});
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<UseFormReturn<T>["errors"]>(
    {} as UseFormReturn<T>["errors"],
  );

  // keep track of latest validation function in a ref
  useEffect(() => {
    validationFunction.current = validate;
  }, [validate]);

  const setError = useCallback(
    <K extends keyof T>(field: K, error: string | undefined) => {
      if (!error) {
        setErrors((prev) => {
          if (!prev) return prev;
          return Object.keys(prev).reduce((acc, key) => {
            if (key === field) return acc;

            return {
              ...acc,
              [key]: prev?.[key as K],
            };
          }, {});
        });
        return;
      }

      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    },
    [],
  );

  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      const newValues = {
        ...values,
        [field]: value,
      };

      const errs = validationFunction.current?.(newValues);
      setErrors(errs);

      setValues(newValues);
      triggerChange.current = true;
    },
    [values],
  );

  const isValid = useMemo(() => {
    return Object.keys(errors || {}).length === 0;
  }, [errors]);

  const validateForm = useCallback(
    (touchAll: boolean = true) => {
      const err = validationFunction.current?.(values);
      setErrors(err);
      if (touchAll) {
        setTouched(
          Object.keys(values).reduce((acc, key) => {
            return {
              ...acc,
              [key]: true,
            };
          }, {}),
        );
      }
    },
    [values],
  );

  const register = useCallback(
    <K extends keyof T>(name: K) => {
      const handleBlur = () => {
        setTouched((prev) => ({
          ...prev,
          [name]: true,
        }));

        validateForm(false);
      };

      const handleChange = (value: T[K]) => {
        setValue(name, value);
      };

      return {
        onBlur: handleBlur,
        onChange: handleChange,
      };
    },
    [setValue, validateForm],
  );

  const form = useMemo(() => {
    return {
      values,
      setValue,
      errors,
      setError,
      isValid,
      register,
      setValues,
      touched,
      validate: validateForm,
    };
  }, [
    touched,
    values,
    setValue,
    errors,
    setError,
    isValid,
    register,
    validateForm,
  ]);

  useEffect(() => {
    if (!triggerChange.current) return;
    triggerChange.current = false;
    onChange?.(form);
  }, [form, onChange]);

  return form;
}
