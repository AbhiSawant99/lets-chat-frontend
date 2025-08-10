import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setUserDetails(null);
          navigate("/login", { replace: true }); // replace history
          return;
        }

        const data = await res.json();
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  return (
    <div>
      <h1>Profile Page</h1>
      <p>{userDetails ? JSON.stringify(userDetails) : null}</p>
      <a href="http://localhost:3000/logout">Logout</a>
    </div>
  );
};

export default Profile;
