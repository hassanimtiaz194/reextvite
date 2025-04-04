import React, { useState, useEffect } from "react";
import ReExt from "@sencha/reext";
import { db, collection, getDocs } from "../configs/firebaseConfig"; // Assuming Firestore is used

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [userStats, setUserStats] = useState([]); // For storing yearly user count
  const [gridWidth, setGridWidth] = useState(
    window.innerWidth <= 768 ? 300 : 700
  );

  useEffect(() => {
    const handleResize = () => {
      setGridWidth(window.innerWidth <= 768 ? 300 : 800);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch users data from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.userType === "user") {
          userList.push(userData);
        }
      });

      setUsers(userList);
      calculateUserStats(userList);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  // Function to calculate user stats by year
  const calculateUserStats = (users) => {
    const stats = {};

    users.forEach((user) => {
      const year = new Date(user.createdAt.seconds * 1000).getFullYear(); // Extract the year from the timestamp
      stats[year] = stats[year] ? stats[year] + 1 : 1;
    });

    setUserStats(
      Object.entries(stats).map(([year, count]) => ({ year, count }))
    );
  };

  // Format the createdAt timestamp to a readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString(); // You can customize the format here
  };

  // Paginate users data
  const paginatedUsers = users.slice(
    (pagination.page - 1) * pagination.pageSize,
    pagination.page * pagination.pageSize
  );

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="userContainer">
      {userStats.length !== 0 && (
        <ReExt
          xtype="chart"
          className="reextForm"
          config={{
            title: "Users Joined By Year",
            width: gridWidth,
            height: 800,
            store: userStats, // Directly use updated userStats
            axes: [
              {
                type: "category",
                position: "bottom",
                fields: ["year"],
                title: "Year",
              },
              {
                type: "numeric",
                position: "left",
                fields: ["count"],
                title: "Number of Users",
                grid: true,
              },
            ],
            series: [
              {
                type: "bar",
                xField: "year",
                yField: "count",
                label: {
                  display: "insideEnd",
                  field: "count",
                  renderer: (value) => value, // To display the count on top of bars
                },
                style: {
                  fill: "#4CAF50", // Green color for bars
                },
              },
            ],
          }}
        />
      )}
      <ReExt
        key={JSON.stringify(users)} // Add key to force re-render on users data change
        xtype="grid" // Directly use grid without form
        className="reextTable"
        config={{
          title: "Users List",
          width: gridWidth,
          height: 800,
          bodyPadding: 16,
          store: users, // Ensure that 'users' is properly populated
          columns: [
            { text: "Name", dataIndex: "name", width: 200 },
            { text: "Email", dataIndex: "email", width: 200 },
            {
              text: "Created At",
              dataIndex: "createdAt",
              width: "100%",
              renderer: (value) => formatDate(value), // Format the createdAt field
            },
          ],
          //height: 400,
        }}
      />
    </div>
  );
};

export default Users;
