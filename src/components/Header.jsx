import React from "react";
import { useAuth } from "../utils/AuthContext";
import { LogOut } from "react-feather";

const Header = () => {
  const { user, handleUserLogout } = useAuth();
  return (
    <div id="header--wrapper">
      {user ? (
        <>
          <p>Welcome {user.name}</p>
          <LogOut onClick={() => handleUserLogout()} className="header--link" />
        </>
      ) : (
        <button>Login</button>
      )}
    </div>
  );
};

export default Header;
