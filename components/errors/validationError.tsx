import { FieldErrors } from "react-hook-form";

interface Props {
  errors: FieldErrors;
  name: string;
}

export default function ValidationError({ errors, name }: Props) {
  const getNestedError = (obj: any, path: string) => {
    return path.split(`.`).reduce((acc, key) => acc?.[key], obj);
  };
  const errorMessage = getNestedError(errors, name)?.message as
    | string
    | undefined;
  if (!errorMessage) return null;
  return <div className="mt-2 px-5 text-xs text-red-500">{errorMessage}</div>;
}
