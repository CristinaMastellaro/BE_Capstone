import { BiHome, BiLibrary, BiSearch, BiWorld } from "react-icons/bi";
import "../scss/customNav.scss";
import { Link } from "react-router-dom";
import { GrSettingsOption } from "react-icons/gr";
import { TiTime } from "react-icons/ti";
import { useAppDispatch } from "../redux/store";
import { showDetails } from "../redux/actions";

const CustomNavbar = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <div>
        <h1
          className="mb-4 d-none d-lg-block text-center"
          style={{ fontSize: "3.8em" }}
        >
          Muse
        </h1>
        <div className="mt-lg-4 d-flex justify-content-around d-lg-block ">
          <Link
            to="/homepage"
            className="mt-2 p-1 options text-white text-decoration-none"
            onClick={() => dispatch(showDetails(false))}
          >
            <BiHome className="my-icons me-lg-2 fs-4" />
            <span className="d-none d-lg-block">Home</span>
          </Link>
          <Link
            to="/searchCountry"
            className="mt-2 p-1 options text-white text-decoration-none"
            onClick={() => dispatch(showDetails(false))}
          >
            <BiWorld className="my-icons me-lg-2 fs-4" />
            <span className="d-none d-lg-block">Countries</span>
          </Link>
          <Link
            to="/periods"
            className="mt-2 p-1 options text-white text-decoration-none"
            onClick={() => dispatch(showDetails(false))}
          >
            <TiTime className="my-icons me-lg-2 fs-4" />
            <span className="d-none d-lg-block">Periods</span>
          </Link>
          <Link
            to="/search"
            className="mt-2 p-1 options text-white text-decoration-none"
            onClick={() => dispatch(showDetails(false))}
          >
            <BiSearch className="my-icons me-lg-2 fs-4" />
            <span className="d-none d-lg-block">Search</span>
          </Link>
          <Link
            to="/library"
            className="mt-2 p-1 options text-white text-decoration-none"
            onClick={() => dispatch(showDetails(false))}
          >
            <BiLibrary className="my-icons me-lg-2 fs-4" />
            <span className="d-none d-lg-block">Library</span>
          </Link>
          <Link
            to="/settings"
            className="mt-2 p-1 options text-white text-decoration-none"
            onClick={() => dispatch(showDetails(false))}
          >
            <GrSettingsOption className="my-icons me-lg-2 fs-4" />
            <span className="d-none d-lg-block">Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CustomNavbar;
