import React, { useEffect } from "react";
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_seller_dashboard_data } from "../../store/Reducers/dashboardReducer";
import moment from "moment";
import customer from "../../assets/demo.jpg";
const SellerDashboard = () => {
  const dispatch = useDispatch();
  const {
    totalSale,
    totalOrder,
    totalProduct,
    totalPendingOrder,
    recentOrder,
    recentMessage,
  } = useSelector((state) => state.dashboard);
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(get_seller_dashboard_data());
  }, []);

  const state = {
    series: [
      {
        name: "Orders",
        type: 'area',
        data: [23, 34, 45, 56, 76, 34, 23, 76, 87, 78, 34, 45]
      },
      {
        name: "Revenue",
        type: 'line',
        data: [67, 39, 45, 56, 90, 56, 23, 56, 87, 78, 67, 78]
      },
      {
        name: "Sales",
        type: 'line',
        data: [34, 39, 56, 56, 80, 67, 23, 56, 98, 78, 45, 56]
      },
      {
        name: "Products",
        type: 'line',
        data: [45, 32, 68, 54, 72, 45, 43, 67, 89, 96, 58, 87]
      }
    ],
    options: {
      chart: {
        background: 'transparent',
        toolbar: {
          show: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: [0, 3, 3, 3]
      },
      fill: {
        type: ['gradient', 'solid', 'solid', 'solid'],
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          opacityFrom: 0.8,
          opacityTo: 0.2,
        }
      },
      colors: ['#4f46e5', '#059473', '#f97316', '#8b5cf6'],
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: '#64748b'
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val) {
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
        }
      }
    }
  };

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
        <div className="flex justify-between items-center p-5 bg-white rounded-lg shadow-md border border-blue-100">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold text-gray-700">{totalSale} INR</h2>
            <span className="text-sm font-medium text-gray-500">Total Sales</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-blue-500 flex justify-center items-center text-xl">
            <MdCurrencyExchange className="text-white" />
          </div>
        </div>

        <div className="flex justify-between items-center p-5 bg-white rounded-lg shadow-md border border-blue-100">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold text-gray-700">{totalOrder}</h2>
            <span className="text-sm font-medium text-gray-500">Orders</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-blue-500 flex justify-center items-center text-xl">
            <FaCartShopping className="text-white" />
          </div>
        </div>

        <div className="flex justify-between items-center p-5 bg-white rounded-lg shadow-md border border-blue-100">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold text-gray-700">{totalProduct}</h2>
            <span className="text-sm font-medium text-gray-500">Products</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-blue-500 flex justify-center items-center text-xl">
            <MdProductionQuantityLimits className="text-white" />
          </div>
        </div>

        <div className="flex justify-between items-center p-5 bg-white rounded-lg shadow-md border border-blue-100">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-3xl font-bold text-gray-700">{totalPendingOrder}</h2>
            <span className="text-sm font-medium text-gray-500">Pending Orders</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-blue-500 flex justify-center items-center text-xl">
            <FaUsers className="text-white" />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-wrap mt-7">
        <div className="w-full lg:w-7/12 lg:pr-3">
          <div className="w-full bg-white shadow-lg rounded-lg p-4">
            <Chart
              options={state.options}
              series={state.series}
              type="line"
              height={350}
            />
          </div>
        </div>

        <div className="w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0">
          <div className="w-full bg-white shadow-lg rounded-lg p-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-semibold text-lg text-gray-700">Recent Messages</h2>
              <Link className="text-sm text-blue-500 hover:text-blue-600">View All</Link>
            </div>
            <div className="flex flex-col gap-2 pt-6 text-[#d0d2d6]">
              <ol className="relative border-1 border-slate-600 ml-4">
                {recentMessage.map((m, i) => (
                  <li className="mb-3 ml-6">
                    <div className="flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#4c7fe2] rounded-full z-10">
                      {m.senderId === userInfo._id ? (
                        <img
                          className="w-full rounded-full h-full shadow-lg"
                          src={userInfo.image}
                          alt=""
                        />
                      ) : (
                        <img
                          className="w-full rounded-full h-full shadow-lg"
                          src={customer}
                          alt=""
                        />
                      )}
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg border border-slate-600 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <Link className="text-md font-normal">
                          {m.senderName}
                        </Link>
                        <time className="mb-1 text-sm font-normal sm:order-last sm:mb-0">
                          {" "}
                          {moment(m.createdAt).startOf("hour").fromNow()}
                        </time>
                      </div>
                      <div className="p-2 text-xs font-normal bg-slate-700 rounded-lg border border-slate-800">
                        {m.message}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full p-4 bg-[#6a5fdf] rounded-md mt-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-[#d0d2d6] pb-3 ">
            Recent Orders
          </h2>
          <Link className="font-semibold text-sm text-[#d0d2d6]">View All</Link>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
              <tr>
                <th scope="col" className="py-3 px-4">
                  Order Id
                </th>
                <th scope="col" className="py-3 px-4">
                  Price
                </th>
                <th scope="col" className="py-3 px-4">
                  Payment Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Order Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Active
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrder.map((d, i) => (
                <tr key={i}>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap">
                    #{d._id}
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap">
                    ${d.price}
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap">
                    {d.payment_status}
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap">
                    {d.delivery_status}
                  </td>
                  <td
                    scope="row"
                    className="py-3 px-4 font-medium whitespace-nowrap">
                    <Link to={`/seller/dashboard/order/details/${d._id}`}>
                      View
                    </Link>{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;