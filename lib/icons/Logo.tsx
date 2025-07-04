import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "types";

export const Logo: React.FC<IconProps> = ({
  size = 36,
  color = "currentColor",
  ...props
}) => (
  <Svg fill="none" height={size} viewBox="0 0 32 32" width={size} {...props}>
    <Path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill={color}
      fillRule="evenodd"
    />
  </Svg>
);
