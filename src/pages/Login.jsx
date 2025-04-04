import { Link, useNavigate } from "react-router-dom";
import ReExt from "@sencha/reext";
import {
  auth,
  signInWithEmailAndPassword,
  db,
  getDoc,
  doc,
} from "../configs/firebaseConfig";

const Login = () => {
  const navigate = useNavigate();
  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("Logged in user data:", userData);

        // Save user data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        return userData;
      } else {
        console.log("No user data found.");
        return null;
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      return false;
    }
  };

  return (
    <div className="loginContainer">
      <ReExt
        xtype="form"
        className="reextForm"
        config={{
          title: "Login",
          width: 400,
          height: 200,
          bodyPadding: 16,
          buttons: [
            {
              xtype: "button",
              text: "Login",
              anchor: "100%",
              handler: async function (btn) {
                let form = this.up("form");
                if (form.isValid()) {
                  let values = form.getValues();
                  let { email, password } = values;

                  btn.setDisabled(true);
                  try {
                    const userData = await loginUser(email, password);
                    if (userData) {
                      navigate('/')
                      Ext.toast({
                        html: "Login successful! 🎉",
                        align: "t",
                        width: 300,
                        timeout: 3000,
                      });
                    } else {
                      Ext.toast({
                        html: "Login failed. Please try again.",
                        align: "t",
                        width: 300,
                        timeout: 3000,
                      });
                    }
                    form.reset();
                  } catch (error) {
                    Ext.toast({
                      html: `Error: ${error.message}`,
                      align: "t",
                      width: 300,
                      timeout: 3000,
                    });
                  } finally {
                    btn.setDisabled(false);
                  }
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

      {/* Link to Signup */}
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
