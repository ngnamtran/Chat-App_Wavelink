import React from "react";
import { Avatar, Box, Stack, IconButton, Divider, Switch } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import Logo from "../../assets/Images/logo.ico"
import { Nav_Buttons } from "../../data";
import { Gear } from "phosphor-react";
import { useState } from "react";




const DashboardLayout = () => {

  const theme = useTheme();
  const [selected, setSelected] = useState(0);

  return (
    <>
      <Box
        p={2}
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
          height: "100vh",
          width: 100 ,
        }}>
        < Stack 
          direction="column"
          alignItems={"center"}
          justifyContent="space-between"
          sx={{ height: "100%" }}
          spacing={3}
          >
          <Stack alignItems ={"center"} spacing = {4}>
            <Box
              sx={{
                backgroundColor: theme.palette.primary.main,
                height: 64,
                width: 64,
                borderRadius: 1.5,
              }}>
              <img src={Logo} alt={"Chat App Logo"} />
            </Box>
            <Stack 
              sx={{ width: "max-content" }}
              direction="column"
              alignItems="center"
              spacing={3}>
              {Nav_Buttons.map((el) =>
                el.index === selected ? (
                  <Box
                    key={el.index}
                    p={1}
                    sx={{
                      background: theme.palette.primary.main,
                      borderRadius: 1.5,
                    }}
                  >
                    <IconButton
                      sx={{ width: "max-content", color: "#fff" }}
                      key={el.index}>{el.icon}
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton
                    onClick={() => {
                      setSelected(el.index)
                    }}
                    sx={{ width: "max-content", color: "#c882e8" }}
                    key={el.index}>{el.icon} </IconButton>
                )
              )}
              <Divider sx={{ width: "48px" }} />

              {selected === 3 ? (
                <Box
                  p={1}
                  sx={{
                    background: theme.palette.primary.main,
                    borderRadius: 1.5,
                  }}
                >

                  <IconButton sx={{ width: "max-content", color: "#fff" }}>
                    <Gear />
                  </IconButton>

                </Box>

              ) : (
                <IconButton onClick={() => {
                  setSelected(3);
                }}
                  sx={{ width: "max-content", color: "#c882e8" }} >
                  <Gear />
                </IconButton>
              )}


            </Stack>
          </Stack>

          <Stack spacing >
            {/*Switch*/}
            <Switch defaultChecked  />
            <Avatar src="https://avatar.iran.liara.run/public" />
          </Stack>


        </Stack>
      </Box>
      <Outlet />
    </>
  );
};

export default DashboardLayout;
