import React, { useState, useEffect } from "react";
import { db, collection, getDocs } from "../configs/firebaseConfig"; // Firebase config
import ReExt from "@sencha/reext";
import { addDoc } from "firebase/firestore";

const AllInventory = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [isHovered, setIsHovered] = useState(null);

  useEffect(() => {
    const targets = [
      'ReExt displayfield',
      'ReExt form',
      'ReExt grid',
      'ReExt polar',
      'ReExt combobox',
      'ReExt chart',
    ];
  
    const divs = document.querySelectorAll('div');
    for (let div of divs) {
      if (targets.includes(div.textContent.trim())) {
        div.style.display = 'none';
      }
    }
  }, []);
  

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "items"));
    const itemList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      price: parseFloat(doc.data().price),
    }));
    setItems(itemList);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchSubCategory =
      selectedSubCategory === "" || item.subCategory === selectedSubCategory;
    return matchCategory && matchSubCategory;
  });

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
                  let { category, subCategory } = values;
                  setSelectedCategory(category);
                  setSelectedSubCategory(subCategory);
                },
              },
            ],
            items: [
              {
                xtype: "combobox",
                fieldLabel: "Category",
                name: "category",
                anchor: "100%",
                store: [
                  "All",
                  "Electronics",
                  "Clothing",
                  "Furniture",
                  "Books"
                ]
                ,
              },
              {
                xtype: "combobox",
                fieldLabel: "Sub-Category",
                name: "subCategory",
                anchor: "100%",
                store: [
                  "Mobile",
                  "Laptop",
                  "Accessories",
                  "T-Shirt",
                  "Shoes",
                  "Sweatshirt",
                  "Chair",
                  "Table",
                  "Storage",
                  "Novel",
                  "Technical"
                ]
              },
            ],
          }}
        />
      </div>

      <div style={{ width: "80%" }}>
        {filteredItems.length !== 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              paddingBottom: "200px",
              justifyContent: "center",
              paddingLeft: 50,
            }}
          >
            {filteredItems.map((item, index) => (
              <div
                key={index}
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
                style={{
                  border: "1px solid #ddd",
                  backgroundColor: "white",
                  margin: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  width: "300px",
                  boxShadow:
                    isHovered === index
                      ? "0px 4px 10px rgba(0, 0, 0, 0.5)"
                      : "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
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
                <ReExt
                  xtype="displayfield"
                  className="cardTitle"
                  style={{ marginBottom: "5px" }}
                  config={{ value: `${item.itemName}` }}
                />
                <ReExt
                  xtype="displayfield"
                  style={{ marginBottom: "5px", color: "#ff5733" }}
                  config={{ value: `$ ${item.itemPrice}` }}
                  className="cardPrice"
                />
                <ReExt
                  xtype="displayfield"
                  style={{ marginBottom: "5px", color: "blue" }}
                  config={{ value: `Category: ${item.category}` }}
                  className="cardCategory"
                />
                <ReExt
                  xtype="displayfield"
                  style={{ marginBottom: "5px", color: "green" }}
                  config={{ value: `Sub-Category: ${item.subCategory || "N/A"}` }}
                  className="cardSubCategory"
                />
                <ReExt
                  xtype="displayfield"
                  style={{ marginBottom: "5px" }}
                  className="cardDescription"
                  config={{
                    value: `Description: ${item.itemDescription.substring(0, 50)}...`,
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
