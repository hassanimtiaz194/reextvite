import React, { useState, useEffect } from "react";
import ReExt from "@sencha/reext";
import { db, collection, getDocs } from "../configs/firebaseConfig";

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Electronics");
  const [itemStats, setItemStats] = useState([]); // Category-wise stats
  const [itemCategoryStats, setItemCategoryStats] = useState(null);
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

  function calculateQuantityStats(items) {
    const stats = {};

    items.forEach(item => {
      // Initialize category if it doesn't exist
      if (!stats[item.category]) {
        stats[item.category] = { total: 0 };
      }

      // Initialize subCategory if it doesn't exist under the category
      if (item.subCategory && !stats[item.category][item.subCategory]) {
        stats[item.category][item.subCategory] = 0;
      }

      // Aggregate the quantities
      stats[item.category].total += item.itemQuantity;
      if (item.subCategory) {
        stats[item.category][item.subCategory] += item.itemQuantity;
      }
    });

    return stats;
  }

  // Fetch inventory items from Firestore
  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "items"));
      const itemList = [];

      querySnapshot.forEach((doc) => {
        itemList.push(doc.data());
      });

      console.log(itemList)
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

    const quanStats = calculateQuantityStats(items);
    setItemCategoryStats(quanStats);
  };

  const renderCategoryStats = () => {
    if (!selectedCategory) return null;

    const categoryStats = itemCategoryStats[selectedCategory];

    return (
      <div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', paddingBottom: '10px', paddingTop: '10px' }}>
            {selectedCategory} Quatity Stats
          </div>
          <div className="renderTotal">
            <div className="renderTotalItem"><span style={{
              fontSize: '14px',
              fontWeight: 700,
            }}>Total:</span> <span
              style={{
                fontSize: '12px',
                fontWeight: 500,
              }}>{categoryStats.total}</span></div>
            {Object.keys(categoryStats)
              .filter((key) => key !== 'total')
              .map((subcategory) => (
                <div key={subcategory} className="renderTotalItem">
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 700,
                  }}>{subcategory}:</span> <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 500,
                    }}>{categoryStats[subcategory]}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="userContainer">
      {/* Pie Chart for category-wise distribution */}
      <div className="chartContainer">
        {itemStats.length > 0 && (
          <>
            <div className="normalContainer">
              <ReExt
                xtype="polar"
                className="reextChart"
                config={{
                  title: "Items by Category",
                  width: gridWidth,
                  height: 250,
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
            </div>
            <div className="normalContainer" style={{ minHeight: '200px', padding: '30px' }}>
              <div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    paddingBottom: '10px'
                  }}>Select Category:</div>
                  <div>
                    <ReExt
                      xtype="combobox"
                      className="reextCombo"
                      config={{
                        name: "category",
                        store: ["Electronics", "Clothing", "Furniture", "Books"],
                        anchor: "100%",
                        listeners: {
                          select: function (combo, newVal) {
                            setSelectedCategory(combo.value);
                          },
                        }
                      }}
                    />
                  </div>
                </div>
                {renderCategoryStats()}
                {/* <div>
                  <div><div>Total {selectedCategory}</div><div></div></div>
                  <div><div></div><div></div></div>
                </div> */}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="normalContainer">
        <ReExt
          key={JSON.stringify(items)} // Add key to force re-render on items data change
          xtype="grid"
          className="reextTable"
          config={{
            title: "Inventory List",
            width: gridWidth,
            height: 500,
            bodyPadding: 16,
            store: items, // Ensure that 'items' is properly populated
            columns: [
              { text: "Item Name", dataIndex: "itemName", width: 200 },
              { text: "Category", dataIndex: "category", width: 200 },
              { text: "Price", dataIndex: "itemPrice", width: 150 },
              { text: "Quantity", dataIndex: "itemQuantity", width: 150 },
              {
                text: "Description",
                dataIndex: "itemDescription",
                width: "100%",
              },
            ],
          }}
        />
      </div>
    </div >
  );
};

export default InventoryPage;
