import { JSX } from "react";
import NewReservations from "../new-reservations/new-reservations";
import InboxIcon from '@mui/icons-material/MoveToInbox';

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
    icon: <InboxIcon />
  },
  {
    path: "/NewReservations",
    element: <NewReservations />,
    name: "New Reservations",
    icon: <InboxIcon />
  },
];
