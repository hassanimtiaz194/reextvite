import React, { useState, useEffect } from "react";
import { db, collection, getDocs } from "../configs/firebaseConfig"; // Firebase config
import { addDoc } from "firebase/firestore";
import ReExt from "@sencha/reext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const AllInventory = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [isHovered, setIsHovered] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="allInventoryContainer" style={{ flexWrap: "wrap", gap: "16px", display: "flex" }}>
      <div className="filterContainer">
        <ReExt
          xtype="form"
          className="reextForm reextFilter"
          config={{
            title: "Search",
            width: "100%",
            bodyPadding: 16,
            buttons: [
              {
                xtype: "button",
                text: "search",
                handler: function () {
                  const form = this.up("form");
                  const { category, subCategory } = form.getValues();
                  setSelectedCategory(category);
                  setSelectedSubCategory(subCategory);
                  setCurrentPage(1); // reset to first page on filter
                },
              },
            ],
            items: [
              {
                xtype: "combobox",
                fieldLabel: "Category",
                name: "category",
                anchor: "100%",
                store: ["All", "Electronics", "Clothing", "Furniture", "Books"],
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
                  "Technical",
                ],
              },
            ],
          }}
        />
      </div>
      <div className="allInventoryContainerss">
        {filteredItems.length > 0 ? (
          <>
            <Swiper
              spaceBetween={10}
              slidesPerView={window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              style={{ paddingBottom: "50px" }}
            >
              {paginatedItems.map((item, index) => (
                <SwiperSlide key={item.id}>
                  <div
                    onMouseEnter={() => setIsHovered(index)}
                    onMouseLeave={() => setIsHovered(null)}
                    style={{
                      border: "1px solid #ddd",
                      backgroundColor: "white",
                      margin: "5px auto",
                      minHeight: '390px',
                      maxHeight: '390px',
                      borderRadius: "8px",
                      textAlign: "center",
                      width: "90%",
                      boxShadow:
                        isHovered === index
                          ? "0px 4px 12px rgba(0, 0, 0, 0.3)"
                          : "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.itemName}
                      style={{ width: "100%", height: 200, borderRadius: "8px 8px 0 0", objectFit: "cover" }}
                    />
                    <div style={{ padding: "10px" }}>
                      <ReExt
                        xtype="displayfield"
                        className="cardTitle"
                        config={{ value: `${item.itemName}` }}
                      />
                      <ReExt
                        xtype="displayfield"
                        style={{ color: "#ff5733" }}
                        className="cardPrice"
                        config={{ value: `$${item.itemPrice}` }}
                      />
                      <ReExt
                        xtype="displayfield"
                        style={{ color: "blue" }}
                        className="cardCategory"
                        config={{ value: `Category: ${item.category}` }}
                      />
                      <ReExt
                        xtype="displayfield"
                        style={{ color: "green" }}
                        className="cardSubCategory"
                        config={{ value: `Sub-Category: ${item.subCategory || "N/A"}` }}
                      />
                      <ReExt
                        xtype="displayfield"
                        className="cardDescription"
                        config={{
                          value: `Description: ${item.itemDescription?.substring(0, 50) ?? ""}...`,
                        }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  style={{
                    backgroundColor: currentPage === page ? "#0eb5a3" : "#e0e0e0",
                    color: currentPage === page ? "white" : "black",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: 50 }}>
            <p>No items found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllInventory;
