import Button from "react-bootstrap/Button";


type Props = {
  provider: "Google" | "Facebook";
  type: "Signin" | "Signup";
  [others: string]: any;
};

const SocialButton: React.FC<Props> = ({ provider, type, ...others }) => {
  return (
    <Button
      size="lg"
      className={`btn-social ${
        provider === "Google" ? "btn-google" : "btn-facebook"
      }`}
      {...others}
    >
      <i
        className={`ri-${provider.toLowerCase()}${
          provider === "Facebook" ? "-box" : ""
        }-fill`}
      />
      {`${type} with ${provider}`}
    </Button>
  );
};

export default SocialButton;
