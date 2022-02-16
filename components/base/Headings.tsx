import * as React from "react";
import { Heading, IHeadingProps } from "native-base";

export const HeroHeading = (props: IHeadingProps) => (
  <Heading size="xl" {...props}>
    {props.children}
  </Heading>
);

export const TitleHeading = (props: IHeadingProps) => (
  <Heading size="md" {...props}>
    {props.children}
  </Heading>
);

export const SubtitleHeading = (props: IHeadingProps) => (
  <Heading size="sm" {...props}>
    {props.children}
  </Heading>
);
