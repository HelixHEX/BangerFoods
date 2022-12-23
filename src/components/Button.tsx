import { Button as ButtonComp } from "@chakra-ui/react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "outline" | "solid";
  bg?: string;
  borderColor?: string;
  color?: string;
  borderRadius?: number | string;
  w?: string | number;
  onClick?: () => void;
  loading?: boolean;
  h?: string | number;
  props?: any
  disabled?: boolean
};

const Button = ({
  children,
  variant = "outline",
  bg,
  borderColor = "primary",
  color = "primary",
  borderRadius = 5,
  w = "100%",
  onClick,
  loading = false,
  h=50,
  disabled=false,
  props,
}: ButtonProps) => {
  return (
    <>
      <ButtonComp
      disabled={disabled}
        {...props}
        isLoading={loading}
        onClick={onClick}
        borderRadius={borderRadius}
        _hover={{
          bg: variant === "outline" ? borderColor : "secondary",
          color: "white",
        }}
        variant={variant}
        color={color}
        bg={bg}
        w={w}
        borderColor={borderColor}
        h={h}
        
      >
        {children}
      </ButtonComp>
    </>
  );
};

export default Button;
