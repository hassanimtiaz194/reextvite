import React, { useState, useEffect } from "react";
import ReExt from "@sencha/reext";
import { db, collection, getDocs } from "../configs/firebaseConfig";

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [itemStats, setItemStats] = useState([]); // Category-wise stats
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

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch inventory items from Firestore
  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "items"));
      const itemList = [];

      querySnapshot.forEach((doc) => {
        itemList.push(doc.data());
      });

      setItems(itemList);
      calculateItemStats(itemList);
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };

  // Calculate category-wise item count
  const calculateItemStats = (items) => {
    const stats = {
      Electronics: 0,
      Clothing: 0,
      Books: 0,
      Furniture: 0,
    };

    items.forEach((item) => {
      if (stats[item.category] !== undefined) {
        stats[item.category] += 1;
      }
    });

    // Convert to ExtJS-compatible store format
    setItemStats(
      Object.entries(stats).map(([category, count], index) => ({
        id: `category-${index}`,
        category,
        count,
      }))
    );
  };

  return (
    <div className="userContainer">
      {/* Pie Chart for category-wise distribution */}
      {itemStats.length > 0 && (
        <ReExt
          xtype="polar"
          className="reextForm"
          config={{
            title: "Items by Category",
            width: gridWidth,
            height: 800,
            insetPadding: 50,
            interactions: ["rotate", "itemhighlight"],
            store: {
              fields: ["category", "count"],
              data: itemStats.filter((item) => item.count > 0), // Remove categories with 0 count
            },
            series: [
              {
                type: "pie",
                angleField: "count",
                donut: 30, // Donut chart effect
                label: {
                  field: "category",
                  display: "rotate", // Ensure labels are readable
                  contrast: true,
                },
                highlight: true,
                colors: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1"], // Assign colors to categories
                tooltip: {
                  trackMouse: true,
                  renderer: (tooltip, record) => {
                    tooltip.setHtml(
                      `${record.get("category")}: ${record.get("count")}`
                    );
                  },
                },
              },
            ],
          }}
        />
      )}
      {console.log(gridWidth)}
      <ReExt
        key={JSON.stringify(items)} // Add key to force re-render on items data change
        xtype="grid"
        className="reextTable"
        config={{
          title: "Inventory List",
          width: gridWidth,
          height: 800,
          bodyPadding: 16,
          store: items, // Ensure that 'items' is properly populated
          columns: [
            { text: "Item Name", dataIndex: "name", width: 200 },
            { text: "Category", dataIndex: "category", width: 200 },
            { text: "Price", dataIndex: "price", width: 150 },
            { text: "Quantity", dataIndex: "itemQuantity", width: 150 },
            {
              text: "Description",
              dataIndex: "description",
              width: "100%",
            },
          ],
        }}
      />
    </div>
  );
};

export default InventoryPage;
