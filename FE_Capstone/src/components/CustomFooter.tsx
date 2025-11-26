const CustomFooter = () => {
  return (
    <>
      <div className="mb-5 mt-3 pb-2 pb-lg-0 mb-lg-0 opacity-75">
        <p className="text-center small mb-1">
          © Copyright - {new Date().getFullYear()}
        </p>
        <p className="text-center small mb-0">
          Made by:{" "}
          <a
            href="https://github.com/CristinaMastellaro/BE_Capstone"
            target="_blank"
            className="text-white"
          >
            Cristina Mastellaro
          </a>
        </p>
        <p className="text-center small">
          External API used: Last.fm, Deezer with strive-school
        </p>
      </div>
    </>
  );
};

export default CustomFooter;
