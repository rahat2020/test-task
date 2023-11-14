
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { Card, Typography } from "@material-tailwind/react";
import MkdSDK from "../utils/MkdSDK";
import { AuthContext } from "../authContext";
import { useNavigate } from "react-router";

const TABLE_HEAD = ["Name", "Job", "Employed"];

const AdminDashboardPage = () => {
  const [tableData, setTableData] = useState([]);
  const sdk = new MkdSDK();
  const navigate = useNavigate();
  const { dispatch, role } = useContext(AuthContext);

  // const res = sdk.check(role)
  // console.log('role check', res)
  
  // LOGOUT
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      const tableName = "video";
      sdk.setTable(tableName);

      const payload = {
        "page": 1,
        "limit": 10
      };

      const method = 'POST';
      try {
        const response = await sdk.callRestAPI(payload, method);
        console.log('API Response:', response);
        setTableData(response);
      } catch (error) {
        console.error('API Error:', error.message);
      }
    };

    fetchData();
  }, []);





  return (
    <>
      <div className="w-full flex flex-col justify-center items-center h-screen text-gray-700 p-10 bg-custom-bg">
        <Card className="h-full w-full bg-custom-bg p-20">
          <div className="flex justify-between items-center w-[1000px]">
            <h3 className="text-white font-bold text-4xl">APP</h3>
            <Button className="bg-custom-btn" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <table className="w-[1000px] table-auto text-left bg-custom-bg text-gray-200">
            <thead>
              <tr>
                {TABLE_HEAD?.map((head) => (
                  <th key={head} className="border-b border-blue-gray-100 p-4">
                    <Typography
                      variant="small"
                      className="font-normal leading-none opacity-70 text-gray-500"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData?.map(({ name, job, date }, index) => (
                <tr key={index} className="border-2 border-[#2E2E2E] m-[10px]">
                  <td className="p-4">
                    <Typography variant="small" className="font-normal text-gray-500">
                      {name}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" className="font-normal text-gray-500">
                      {job}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" className="font-normal text-gray-500">
                      {date}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboardPage;
