function Footer() {
  return (
    <footer className="flex flex-col gap-1  backdrop-blur-3xl pt-3 rounded-t-xl text-white">
      <p className="text-center text-black">
        By{" "}
        <a
          href="https://www.facebook.com/alexander.ssn1"
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          Alexander Fernández
        </a>{" "}
        & AlGhoul
      </p>

      <p className="text-center text-black">
        Copyright &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}

export default Footer;
