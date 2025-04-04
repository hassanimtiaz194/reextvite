import React, { useState, useEffect } from "react";
import { db, collection, getDocs } from "../configs/firebaseConfig"; // Import your Firebase config
import ReExt from "@sencha/reext";
import { addDoc } from "firebase/firestore";

const AllInventory = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "items"));
    const itemList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      price: parseFloat(doc.data().price), // Ensure price is a number
    }));
    setItems(itemList);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="allInventoryContainer">
      <div className="filterContainer">
        <ReExt
          xtype="form"
          className="reextForm reextFilter"
          config={{
            title: "Search",
            width: 400,
            height: 400,
            bodyPadding: 16,
            buttons: [
              {
                xtype: "button",
                text: "search",
                handler: async function () {
                  let form = this.up("form");
                  let values = form.getValues();
                  let { category } = values;
                  setSelectedCategory(category);
                },
              },
            ],
            items: [
              {
                xtype: "combobox", // Dropdown for categories
                fieldLabel: "Category",
                name: "category",
                anchor: "100%",
                store: ["All", "Electronics", "Clothing", "Books", "Furniture"], // Sample categories
              },
            ],
          }}
        />
      </div>

      {/* Render filtered items */}
      <div style={{ width: "80%" }}>
        {filteredItems.length !== 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              paddingBottom: "100px",
              justifyContent: "center",
              paddingLeft: 50,
            }}
          >
            {filteredItems.map((item, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  //padding: "10px",
                  margin: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  width: "300px",
                }}
              >
                {/* Item Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    borderRadius: "5px",
                  }}
                />
                <br />
                {/* Item Name */}
                <ReExt
                  xtype="displayfield"
                  className="cardTitle"
                  style={{
                    marginBottom: "5px",
                  }}
                  config={{ value: `${item.name}` }}
                />
                {/* Item Price */}
                <ReExt
                  xtype="displayfield"
                  style={{ marginBottom: "5px", color: "#ff5733" }}
                  config={{ value: `$ ${item.price}` }}
                  className="cardPrice"
                />
                {/* Item Category */}
                <ReExt
                  xtype="displayfield"
                  style={{ marginBottom: "5px", color: "blue" }}
                  config={{ value: `Category: ${item.category}` }}
                  className="cardCategory"
                />
                {/* Item Description */}
                <ReExt
                  xtype="displayfield"
                  style={{
                    marginBottom: "5px",
                  }}
                  className="cardDescription"
                  config={{
                    value: `Description: ${item.description.substring(
                      0,
                      50
                    )}...`,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllInventory;
