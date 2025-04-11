import React, { useState } from "react";
import ReExt from "@sencha/reext";
import {
  createUserWithEmailAndPassword,
  auth,
  db,
  doc,
  setDoc,
} from "../configs/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  return (
    <div className="signupContainer">
      <ReExt
        xtype="form"
        className="reextForm"
        config={{
          title: "Sign up",
          width: 500,
          height: 300,
          bodyPadding: 16,

          buttons: [
            {
              xtype: "button",
              text: "Sign up",
              handler: function () {
                let form = this.up("form");
                if (form.isValid()) {
                  let values = form.getValues();
                  let { name, email, password } = values;

                  createUserWithEmailAndPassword(auth, email, password)
                    .then(async (userCredential) => {
                      const user = userCredential.user;

                      // Save user data to Firestore with userType
                      await setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        name: name,
                        email: email,
                        userType: 'user',
                        createdAt: new Date(),
                      });
                      navigate('/login');
                      // Show success toast
                      Ext.toast({
                        html: "Sign-up successful! Kindly login. 🎉",
                        align: "t", // Position: top
                        width: 300,
                        timeout: 3000, // Auto close in 3s
                      });
                    })
                    .catch((error) => {
                      console.error("Signup error:", error.message);

                      // Show error toast
                      Ext.toast({
                        html: `Error: ${error.message}`,
                        align: "t",
                        width: 300,
                        timeout: 3000,
                        style: { backgroundColor: "#f44336", color: "white" }, // Red error toast
                      });
                    });
                } else {
                  // Show validation error toast
                  Ext.toast({
                    html: "Please fill in all required fields.",
                    align: "t",
                    width: 300,
                    timeout: 3000,
                    style: { backgroundColor: "#ff9800", color: "white" }, // Orange warning toast
                  });
                }
              },
            },
          ],

          items: [
            {
              xtype: "textfield",
              fieldLabel: "Name",
              name: "name",
              anchor: "100%",
              allowBlank: false,
            },
            {
              xtype: "textfield",
              fieldLabel: "Email",
              name: "email",
              anchor: "100%",
              allowBlank: false,
              vtype: "email",
            },
            {
              xtype: "textfield",
              fieldLabel: "Password",
              name: "password",
              anchor: "100%",
              allowBlank: false,
              inputType: "password",
            },
          ],
        }}
      />
    </div>
  );
};

export default Signup;
