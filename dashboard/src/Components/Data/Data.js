import {
    Dashboard,
    Assignment,
    People,
    ShoppingCart,
    InsertChart,
    ExitToApp,
    MonetizationOn,
    Business,
    Group
  } from '@mui/icons-material';
  
  import { AttachMoney, TrendingUp } from "@mui/icons-material";
  export const SidebarData = [
    {
      icon: <Dashboard />,
      heading: "Dashboard",
      path: "/dashboard" // Define the path to navigate to
    },
    {
      icon: <Business />,
      heading: "Represent",
      path: "/represent" // Define the path to navigate to
    },
    {
      icon: <Assignment />,
      heading: "Categories",
      path: "/categories" // Define the path to navigate to
    },
    {
      icon: <People />,
      heading: 'Migrants',
      path: "/migrants" // Define the path to navigate to
    },
    {
      icon: <InsertChart />,
      heading: 'Urbanization',
      path: "/urbanization" // Define the path to navigate to
    },
    {
      icon: <ExitToApp />,
      heading: 'Sign Out',
      path: "/sign-out" // Define the path to navigate to
    }

  ];
  export const cardsData = [
    {
      title: "Sales",
      color: {
        backGround: "linear-gradient(180deg, #B3C100 0%, #B3C100 100%)",
        boxShadow: "0px 10px 20px 0px #6AB187",
      },
      barValue: 70,
      value: "25,970",
      png: <AttachMoney />,
      series: [
        {
          name: "Sales",
          data: [31, 40, 28, 51, 42, 109, 100],
        },
      ],
    },
    {
      title: "Revenue",
      color: {
        backGround: "linear-gradient(180deg, #1F3F49 0%, #1F3F49 100%)",
        boxShadow: "0px 10px 20px 0px #6AB187",
      },
      barValue: 80,
      value: "14,270",
      png: <MonetizationOn />,
      series: [
        {
          name: "Revenue",
          data: [10, 100, 50, 70, 80, 30, 40],
        },
      ],
    },
    {
      title: "Expenses",
      color: {
        backGround:
          "linear-gradient(rgb(248, 212, 154) -146.42%, #488A99 -46.42%)",
        boxShadow: "0px 10px 20px 0px #6AB187",
      },
      barValue: 60,
      value: "4,270",
      png: <Assignment />,
      series: [
        {
          name: "Expenses",
          data: [10, 25, 15, 30, 12, 15, 20],
        },
      ],
    },
  ];
  