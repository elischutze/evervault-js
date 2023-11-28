import { CompiledTheme } from "./types";
import merge from "deepmerge";

const clean = (custom: CompiledTheme = {}) => {
  return merge(
    {
      styles: {
        label: {
          fontSize: 15,
          display: "block",
          marginBottom: 8,
        },
        input: {
          borderRadius: 8,
          lineHeight: 1,
          padding: "10px 15px 12px 15px",
          transition: "box-shadow 40ms ease-in-out",
          boxShadow:
            "inset 0 0 0 1px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.1)",
          "&:focus": {
            boxShadow:
              "inset 0 0 0 2px rgb(0 0 0 / 0.8), 0 1px 2px rgb(0 0 0 / 0.1)",
          },
          "&:invalid:not(:focus)": {
            boxShadow: "inset 0 0 0 2px red, 0 1px 2px rgb(0 0 0 / 0.1)",
          },
        },
        "fieldset[ev-component=pin] input": {
          fontSize: 20,
          paddingTop: 30,
          paddingBottom: 30,
          "&::placeholder": {
            fontSize: 30,
            color: "rgb(0 0 0 / 0.2)",
          },
        },
        ".error": {
          color: "red",
          fontSize: 13,
          marginTop: 5,
        },
      },
    },
    custom,
  );
};

const retro = (custom: CompiledTheme = {}) => {
  return merge(
    {
      fonts: ["https://fonts.googleapis.com/css2?family=VT323&display=swap"],
      styles: {
        body: {
          padding: "30px 20px",
          background: "#C0C0C0",
          fontFamily: "VT323, monospace",
        },
        input: {
          padding: "8px 10px",
          background: "white",
          boxShadow:
            "inset -1px -1px #fff, inset 1px 1px grey, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a",
        },
        label: {
          marginBottom: 5,
          display: "block",
        },
        ".error": {
          marginTop: 5,
          color: "#7B160E",
        },
      },
    },
    custom,
  );
};

const material = (custom: CompiledTheme = {}) => {
  return merge(
    {
      styles: {
        label: {
          top: 10,
          left: 15,
          color: "#666",
          position: "absolute",
          pointerEvents: "none",
          transform: "translateY(8px) scale(1)",
          transformOrigin: "top left",
          transition: "transform 150ms ease-in-out",
        },
        input: {
          background: "#eee",
          padding: "25px 15px 10px 15px",
          "&::placeholder": {
            color: "transparent",
            transition: "color 150ms ease-in-out",
          },
        },
        ".field:focus-within, .field:not(:has(input:placeholder-shown))": {
          "& label": {
            color: "#63e",
            transform: "scale(0.75)",
          },
          "& input::placeholder": {
            color: "#aaa",
          },
        },
        ".error": {
          color: "red",
          fontSize: 12,
          marginTop: 5,
        },
      },
    },
    custom,
  );
};

export const themes = {
  clean,
  retro,
  material,
};
