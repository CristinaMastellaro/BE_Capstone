import { BiBroadcast, BiHome, BiLibrary, BiWorld } from "react-icons/bi";
import "../scss/customNav.scss";
import { Link } from "react-router-dom";

const CustomNavbar = () => {
  return (
    <>
      <div className="z-2">
        {/* <h1 className="mb-4">Sound Adventure</h1> */}
        <h1 className="mb-4 d-none d-lg-block">Moody</h1>
        <div className="mt-lg-4 d-flex justify-content-around d-lg-block ">
          <Link
            to="/homepage"
            className="mt-2 p-1 options text-white text-decoration-none"
          >
            <BiHome className="my-icons me-2 fs-4" />
            <span className="d-none d-lg-block">Home</span>
          </Link>
          <Link
            to="/library"
            className="mt-2 p-1 options text-white text-decoration-none"
          >
            <BiLibrary className="my-icons me-2 fs-4" />
            <span className="d-none d-lg-block">Library</span>
          </Link>
          <Link
            to="/searchCountry"
            className="mt-2 p-1 options text-white text-decoration-none"
          >
            <BiWorld className="my-icons me-2 fs-4" />
            <span className="d-none d-lg-block">Countries</span>
          </Link>
          <div className="mt-2 p-1 options">
            <BiBroadcast className="my-icons me-2 fs-4" />
            <span className="d-none d-lg-block">Notifications</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomNavbar;
