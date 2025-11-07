import { BiBroadcast, BiGrid, BiHome } from "react-icons/bi";
import "../scss/customNav.scss";
import { Link } from "react-router-dom";

const CustomNavbar = () => {
  return (
    <>
      {/* <div className="position-fixed"> */}
      {/* <h1 className="mb-4">Sound Adventure</h1> */}
      <h1 className="mb-4">Moody</h1>
      {/* <div className="border border-1 p-2 rounded-2 d-flex gap-1 align-items-center mb-3">
          <BiSearch className="my-icons me-1 fs-3" />
          <input
            type="text"
            placeholder="Search"
            className="bg-dark border-0 w-100 text-white"
          />
        </div> */}
      <div className="mt-4 ">
        <Link
          to="/homepage"
          className="mt-2 p-1 options text-white text-decoration-none"
        >
          <BiHome className="my-icons me-2 fs-4" /> Home
        </Link>
        <div className="mt-2 p-1 options">
          <BiGrid className="my-icons me-2 fs-4" />
          Library
        </div>
        <div className="mt-2 p-1 options">
          <BiBroadcast className="my-icons me-2 fs-4" /> Notifications
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default CustomNavbar;
