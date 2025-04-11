import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReExt from "@sencha/reext";
import { db, doc, setDoc } from "../configs/firebaseConfig";

const AddItem = () => {
  const navigate = useNavigate();

  return (
    <div className="itemContainer">
      <ReExt
        xtype="form"
        className="reextForm"
        config={{
          title: "Add New Item",
          width: 400,
          height: 450,
          bodyPadding: 16,
          buttons: [
            {
              xtype: "button",
              text: "Add Item",
              handler: async function () {
                let form = this.up("form");
                if (form.isValid()) {
                  let values = form.getValues();
                  let {
                    itemName,
                    itemPrice,
                    itemDescription,
                    category,
                    subCategory, // new field
                    itemQuantity,
                  } = values;
                  const itemRef = doc(db, "items", itemName);
                  await setDoc(itemRef, {
                    name: itemName,
                    price: itemPrice,
                    description: itemDescription,
                    category: category,
                    subCategory: subCategory, // save subcategory
                    itemQuantity: itemQuantity,
                    image:
                      "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png",
                    createdAt: new Date(),
                  });
                  Ext.toast({
                    html: "Item added successfully! 🎉",
                    align: "t",
                    width: 300,
                    timeout: 3000,
                  });
                  form.reset();
                } else {
                  Ext.toast({
                    html: "Please fill in all fields.",
                    align: "t",
                    width: 300,
                    timeout: 3000,
                  });
                }
              },
            },
          ],
          items: [
            {
              xtype: "textfield",
              fieldLabel: "Item Name",
              name: "itemName",
              anchor: "100%",
              allowBlank: false,
            },
            {
              xtype: "textfield",
              fieldLabel: "Item Price",
              name: "itemPrice",
              anchor: "100%",
              allowBlank: false,
              inputType: "number",
            },
            {
              xtype: "textfield",
              fieldLabel: "Item Quantity",
              name: "itemQuantity",
              anchor: "100%",
              allowBlank: false,
              inputType: "number",
            },
            {
              xtype: "textarea",
              fieldLabel: "Item Description",
              name: "itemDescription",
              anchor: "100%",
              allowBlank: false,
            },
            {
              xtype: "combobox",
              fieldLabel: "Category",
              name: "category",
              anchor: "100%",
              store: ["Electronics", "Clothing", "Books", "Furniture"],
              allowBlank: false,
            },
            {
              xtype: "combobox",
              fieldLabel: "Sub Category",
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
              ],
              allowBlank: false,
            },
          ],
        }}
      />

      {/* Link to Items List or Admin Dashboard */}
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        <Link to="/admin/users">Back</Link>
      </p>
    </div>
  );
};

export default AddItem;
