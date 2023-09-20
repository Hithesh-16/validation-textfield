import { Box, FormControl, FormLabel, TextField } from "@mui/material";
import { useState } from "react";

function useLineText(nbLines = 1) {
  const [newLine, setNewLine] = useState("1\n");

  const updateNewLine = function () {
    let myLine = "1\n";
    for (let count = 1; count < nbLines; count++) {
      myLine = myLine + `${count + 1}\n`;
      //console.log(myLine)
    }
    setNewLine(myLine);
  };

  return [newLine, updateNewLine];
}

export const MainBox = () => ({
  display: "flex",
  flexDirection: "row",
  border: 1,
  borderRadius: 2,
  width: "fit-content",
  maxHeight: 3 / 4,
  fontSize: 17.5
});

export const TextArea = () => ({
  borderLeft: "1px solid grey",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
    borderRadius: 0,
    width: 400
  }
});

const FormField = (props) => {
  const { label, inputSx, fullWidth, variant: _variant, endLabel, startLabel, required, value, labelStyle, onChange, sx, ...restProps } = props;

  const [nbLines, setNbLines] = useState(1);
  const [CountLineText, setCountLineText] = useLineText(nbLines);

  function replaceWithBr() {
    return CountLineText.replace(/\n/g, "<br />");
  }

  function useHandleTyping(event) {
    setNbLines(event.target.value.toString().split(/\r\n|\r|\n/).length);
    setCountLineText(nbLines);
    onChange(event);
  }

  return (
    <FormControl fullWidth={fullWidth}>
      <FormLabel htmlFor='outlined-adornment-password' sx={({ fontSize: "1rem" }, labelStyle)}>
        Addresses with amounts
      </FormLabel>

      <Box sx={MainBox} alignItems='flex-start' fullWidth>
        <p dangerouslySetInnerHTML={{ __html: replaceWithBr() }} />

        <TextField
          multiline
          rows={8}
          onChange={useHandleTyping}
          value={value}
          onKeyDown={(evt) => (restProps?.type === "number" ? ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault() : null)}
          sx={{ ...TextArea, ...sx, minHeight: 80, width: 500 }}
          helper
          {...restProps}
        />
      </Box>
    </FormControl>
  );
};

export default FormField;
