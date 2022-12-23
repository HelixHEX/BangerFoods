import { Input as InputComp } from "@chakra-ui/react";

type InputProps = {
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mt?: number;
};

const Input = ({ placeholder, type, value, onChange, mt=0 }: InputProps) => {
  return (
    <>
      <InputComp
        value={value}
        placeholder={placeholder}
        type={type}
        onChange={onChange}
        variant="flushed"
        mt={mt}
        borderColor='primary'
        color='primary'
      />
    </>
  );
};

export default Input;
