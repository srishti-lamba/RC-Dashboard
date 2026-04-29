import { JSX } from "react";
import NewReservations from "../new-reservations/new-reservations";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AllReservations from "../all-reservations/all-reservations";

// https://mui.com/material-ui/material-icons/?theme=Rounded

export interface routeType {
  path: string;
  element: JSX.Element;
  name: string;
  icon: JSX.Element;
}

export const ROUTES : routeType[] = [
  {
    path: "/",
    element: <div className="page"/>,
    name: "Home",
    icon: <HomeRoundedIcon />
  },
  {
    path: "/AllReservations",
    element: <AllReservations />,
    name: "All Reservations",
    icon: <PersonRoundedIcon />
  },
  {
    path: "/NewReservations",
    element: <NewReservations />,
    name: "New Reservations",
    icon: <PersonAddRoundedIcon />
  },
];
