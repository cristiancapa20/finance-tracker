import { sileo } from "sileo";

const darkStyles = {
  fill: "#171717",
  styles: {
    title: "text-white!",
    description: "text-white/75!",
  },
};

export const toast = {
  success: (opts: { title: string; description?: string }) =>
    sileo.success({ ...darkStyles, ...opts }),
  error: (opts: { title: string; description?: string }) =>
    sileo.error({ ...darkStyles, ...opts }),
};