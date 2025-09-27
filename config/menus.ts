import { Image, ShoppingCart, Users, Wallet } from "lucide-react";

export interface MenuItemProps {
  title?: string;
  icon?: React.ElementType;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick?: () => void;
  isHeader?: boolean;
}

export const menus = [
  {
    title: "login ",
    href: "",
  },
];
export const adminConfig: MenuItemProps[] = [
  {
    title: "Users",
    icon: Users,
    href: "users",
  },
  {
    title: "Packages",
    icon: ShoppingCart,
    href: "packages",
  },
  {
    title: "Pending Transactions",
    icon: Wallet,
    href: "transections",
  },
  {
    title: "Payment Requests",
    icon: Wallet,
    href: "payment-request",
  },
  {
    title: "Banners",
    icon: Image,
    href: "banners",
  },
];
