export type ButtonSize = "sm" | "md" | "lg";
export type ButtonWeight = "solid" | "outline" | "ghost";

export type ButtonDesign = {
  label: string;
  size: ButtonSize;
  radius: number; // px
  weight: ButtonWeight;
  iconLeft: boolean;
  iconRight: boolean;
  fullWidth: boolean;
  uppercase: boolean;
};

export const defaultButtonDesign: ButtonDesign = {
  label: "Get started",
  size: "md",
  radius: 12,
  weight: "solid",
  iconLeft: false,
  iconRight: false,
  fullWidth: false,
  uppercase: false,
};
