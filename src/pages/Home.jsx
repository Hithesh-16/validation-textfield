import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import FormField from "./components/FormField";

function Home() {
  const [inputValue, setinputValue] = useState("");
  const [values, setvalues] = useState([]);
  const [dupAdressesObj, setDupAdressesObj] = useState();
  const addressesArr = values.map((item) => item?.address);

  const [errorsList, setErrorsList] = useState([]);

  function handleChange(e) {
    setinputValue(e.target.value);
  }

  function isOnlyDigits(string) {
    for (let i = 0; i < string?.length; i++) {
      var ascii = string.charCodeAt(i);
      if (ascii < 48 || ascii > 57) {
        return false;
      }
    }
    return true;
  }

  const findDuplicates = (arr) => {
    const addArr = arr?.map((item) => item?.address);
    const uniqAddress = [...new Set(addArr)];
    let dupsAddrObj = {};

    uniqAddress.forEach((item) => {
      let addrCount = addArr.filter((addr) => addr === item).length;
      if (addrCount > 1) {
        const occuranceIndeces = [];
        let sum = 0;
        let amounts = [];
        addArr.forEach((addrItem, index) => {
          if (addrItem === item) {
            occuranceIndeces.push(index + 1);
            amounts.push(arr?.[index]?.amount);
            sum += isOnlyDigits(arr?.[index]?.amount) ? Number(arr?.[index]?.amount) : 0;
          }
        });
        dupsAddrObj[item] = { lineNos: [...occuranceIndeces], amountSum: sum, amounts: amounts };
      }
    });

    console.log("choco dupsAddrObj..", dupsAddrObj);

    return dupsAddrObj;
  };

  const findErrors = () => {
    const errorsArr = [];
    const valuesArr = inputValue
      ?.trim()
      .split("\n")
      .map((item, index) => ({ itemNo: index + 1, address: item?.split(/[' '?=]+/)?.[0], amount: item?.split(/[' '?=]+/)?.[1] }));

    setvalues(valuesArr);
    const dupsObj = findDuplicates(valuesArr);

    setDupAdressesObj(dupsObj);

    valuesArr.forEach((item, ind) => {
      if (!isOnlyDigits(item?.amount)) {
        errorsArr.push(`Line ${item?.itemNo} wrong amount`);
      }
    });

    const dupsErrorArr = Object.keys(dupsObj)?.map(
      (item) => `Address ${item} encountered duplicates in Line: ${dupsObj?.[item]?.lineNos.join(", ")}`
    );

    return [...errorsArr, ...dupsErrorArr];
  };

  console.log("choco values", values);

  function keepFirstOne() {
    const alteredArr = [];
    const addArr = values?.map((item) => item?.address);
    const uniqAddress = [...new Set(addArr)];
    const dupAdressKeysArr = Object.keys(dupAdressesObj);
    uniqAddress.forEach((item) => {
      if (dupAdressKeysArr?.includes(item)) {
        alteredArr.push(`${item} ${dupAdressesObj?.[item]?.amounts?.[0]}`);
      } else {
        const data = values?.find((obj) => obj?.address === item);
        alteredArr.push(`${data?.address} ${data?.amount}`);
      }
    });

    setinputValue(alteredArr.join("\n"));
  }

  function combineBalance() {
    const alteredArr = [];
    const addArr = values?.map((item) => item?.address);
    const uniqAddress = [...new Set(addArr)];
    const dupAdressKeysArr = Object.keys(dupAdressesObj);
    uniqAddress.forEach((item) => {
      if (dupAdressKeysArr?.includes(item)) {
        alteredArr.push(`${item} ${dupAdressesObj?.[item]?.amountSum}`);
      } else {
        const data = values?.find((obj) => obj?.address === item);
        alteredArr.push(`${data?.address} ${data?.amount}`);
      }
    });

    setinputValue(alteredArr.join("\n"));
  }

  useEffect(() => {
    setErrorsList(findErrors());
  }, [inputValue]);

  const error = "";
  const helperText = "";
  return (
    <Box sx={{ paddingTop: 20 }}>
      <Stack alignItems='center' fullWidth>
        <FormField onChange={handleChange} value={inputValue} error={error && error} helperText={helperText && helperText} />
      </Stack>
      <Stack>
        <Typography>separated by ',' or '?' or '' or '='</Typography>
      </Stack>

      {errorsList.length >= 1 && (
        <Stack>
          <Stack alignItems='center'>
            <Grid container justifyContent='space-between' sx={{ width: "50%" }}>
              {Object.keys(dupAdressesObj)?.length >= 1 && (
                <>
                  <Grid item xs={6} md={6} lg={6} xl={6}>
                    <Typography sx={{ color: "red", fontSize: 16 }}>Duplicated</Typography>
                  </Grid>
                  <Grid item xs={6} md={6} lg={6} xl={6}>
                    <Typography sx={{ color: "red", fontSize: 16 }}>
                      {" "}
                      <Button sx={{ color: "red", fontSize: 16 }} onClick={keepFirstOne}>
                        Keep the first one{" "}
                      </Button>{" "}
                      |{" "}
                      <Button sx={{ color: "red", fontSize: 16 }} onClick={combineBalance}>
                        Combine balance
                      </Button>{" "}
                    </Typography>{" "}
                  </Grid>
                </>
              )}
            </Grid>

            <Box sx={{ border: "1px solid red", width: 500, minHeight: 10, borderRadius: 5 }}>
              {errorsList?.map((item) => (
                <Typography sx={{ color: "red", fontSize: 14 }}>{item}</Typography>
              ))}
            </Box>
          </Stack>
        </Stack>
      )}

      <Stack alignItems='center'>
        <Button variant='filled' sx={{ bgcolor: "#6956E5", width: 500, color: "white", "&:hover": { backgroundColor: "#1976d2" }, marginTop: 5 }}>
          Next
        </Button>
      </Stack>
    </Box>
  );
}

export default Home;
