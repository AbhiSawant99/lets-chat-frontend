import { getUserProfile } from "@/api/user.api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getUserProfile();

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

export default ProfilePage;
