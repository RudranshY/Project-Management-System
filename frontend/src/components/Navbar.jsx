import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <header className="navbar">
      <div>
        <h2>Project Management System</h2>
      </div>

      <div className="navbar-user">
        <span>{user?.full_name}</span>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;