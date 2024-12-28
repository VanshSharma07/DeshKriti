import { AiOutlineDashboard, AiOutlineShoppingCart } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { FaUserTimes, FaUsers } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FaCodePullRequest } from "react-icons/fa6";
import { IoIosChatbubbles } from "react-icons/io";
import { MdOutlineLiveTv } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { MdViewList } from "react-icons/md";

import { BsCartCheck } from "react-icons/bs";
import { IoChatbubbles } from "react-icons/io5";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { MdCurrencyExchange } from 'react-icons/md';
import { MdDashboard } from 'react-icons/md';
import { FaHandHoldingHeart } from 'react-icons/fa';
import { MdVideoLibrary } from 'react-icons/md';
import { MdLocationOn } from 'react-icons/md';

export const allNav = [
  {
    id: 1,
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "admin",
    path: "/admin/dashboard",
  },
  {
    id: 2,
    title: "Orders",
    icon: <AiOutlineShoppingCart />,
    role: "admin",
    path: "/admin/dashboard/orders",
  },
  {
    id: 3,
    title: "Category",
    icon: <BiCategory />,
    role: "admin",
    path: "/admin/dashboard/category",
  },
  {
    id: 4,
    title: "Sellers",
    icon: <FaUsers />,
    role: "admin",
    path: "/admin/dashboard/sellers",
  },
  {
    id: 5,
    title: "Payment Request",
    icon: <MdPayment />,
    role: "admin",
    path: "/admin/dashboard/payment-request",
  },
  {
    id: 6,
    title: "Inactive Sellers",
    icon: <FaUserTimes />,
    role: "admin",
    path: "/admin/dashboard/deactive-sellers",
  },
  {
    id: 7,
    title: "Seller Request",
    icon: <FaCodePullRequest />,
    role: "admin",
    path: "/admin/dashboard/sellers-request",
  },
  {
    id: 8,
    title: "Live Chat",
    icon: <IoIosChatbubbles />,
    role: "admin",
    path: "/admin/dashboard/chat-sellers",
  },
  {
    id: 9,
    title: "Virtual Events",
    icon: <MdOutlineLiveTv />,
    role: "admin",
    path: "/admin/dashboard/virtual-events",
  },
  {
    id: 10,
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "seller",
    path: "/seller/dashboard",
  },
  {
    id: 11,
    title: "Add Product",
    icon: <IoMdAdd />,
    role: "seller",
    path: "/seller/dashboard/add-product",
  },
  {
    id: 12,
    title: "All Product",
    icon: <MdViewList />,
    role: "seller",
    path: "/seller/dashboard/products",
  },

  {
    id: 13,
    title: "Orders",
    icon: <BsCartCheck />,
    role: "seller",
    path: "/seller/dashboard/orders",
  },
  {
    id: 14,
    title: "Payments",
    icon: <MdPayment />,
    role: "seller",
    path: "/seller/dashboard/payments",
  },
  {
    id: 15,
    title: "Chat-Customer",
    icon: <IoChatbubbles />,
    role: "seller",
    path: "/seller/dashboard/chat-customer",
  },
  {
    id: 16,
    title: "Chat-Support",
    icon: <BsFillChatQuoteFill />,
    role: "seller",
    path: "/seller/dashboard/chat-support",
  },
  {
    id: 17,
    title: "Profile",
    icon: <CgProfile />,
    role: "seller",
    path: "/seller/dashboard/profile",
  },
  {
    id: 18,
    title: "Micro Loans",
    icon: <MdCurrencyExchange />,
    role: "seller",
    subMenu: [
      {
        id: 1,
        title: "Request Loan",
        path: "/seller/dashboard/loan/request",
        status: 'active'
      },
      {
        id: 2,
        title: "My Loans",
        path: "/seller/dashboard/loans",
        status: 'active'
      }
    ],
    status: 'active'
  },
  // Add to admin menu items array
  {
    id: 19,
    title: "Loan Requests",
    icon: <MdCurrencyExchange />,
    role: "admin",
    path: "/admin/dashboard/loan-requests",
  },
  {
    id: 20,
    title: 'Donate India',
    icon: <FaHandHoldingHeart />,
    role: 'admin',
    subMenu: [
      {
        id: 1,
        title: 'All Campaigns',
        path: '/admin/dashboard/campaigns',
        status: 'active'
      },
      {
        id: 2,
        title: 'Create Campaign',
        path: '/admin/dashboard/campaigns/create',
        status: 'active'
      },
      {
        id: 3,
        title: 'Donations',
        path: '/admin/dashboard/campaigns/donations',
        status: 'active'
      }
    ]
  },
  {
    id: 21,
    title: 'Stories',
    icon: <MdVideoLibrary />,
    role: 'seller',
    path: '/seller/dashboard/stories',
    subNav: [
      {
        id: 1,
        title: 'Add Story',
        path: '/seller/dashboard/story/add'
      },
      {
        id: 2,
        title: 'Manage Stories',
        path: '/seller/dashboard/stories'
      }
    ]
  },
  {
    id: 22,
    title: "Locate Post Offices",
    icon: <MdLocationOn />,
    role: "seller",
    path: "/seller/dashboard/post-offices",
  }
];