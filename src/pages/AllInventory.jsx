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
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const itemsPerPage = 9;

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

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const renderCard = (item, index) => (
    <div
      key={item.id}
      onMouseEnter={() => setIsHovered(index)}
      onMouseLeave={() => setIsHovered(null)}
      style={{
        border: "1px solid #ddd",
        backgroundColor: "white",
        margin: "5px auto",
        minHeight: '420px',
        maxHeight: '420px',
        borderRadius: "8px",
        textAlign: "center",
        width: "90%",
        boxShadow:
          isHovered === index
            ? "0px 4px 12px rgba(0, 0, 0, 0.3)"
            : "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{height:'250px', maxHeight: '250px'}}>
        <img
          src={item.image}
          alt={item.itemName}
          style={{ width: "100%", height: "100%", borderRadius: "8px 8px 0 0" }}
        />
      </div>
      <div style={{ padding: "10px" }}>
        <ReExt xtype="displayfield" className="cardTitle" config={{ value: `${item.itemName}` }} />
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
  );

  return (
    <div className="allInventoryContainer" style={{ gap: "16px", display: "flex", paddingBottom: "16em" }}>
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

      <div className="allInventoryContainerss" style={{ width: "100%" }}>
        {filteredItems.length > 0 ? (
          <>
            {isMobileView ? (
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                style={{ paddingBottom: "50px" }}
              >
                {paginatedItems.map((item, index) => (
                  <SwiperSlide key={item.id}>{renderCard(item, index)}</SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "20px",
                  padding: "10px",
                }}
              >
                {paginatedItems.map((item, index) => renderCard(item, index))}
              </div>
            )}

            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
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
