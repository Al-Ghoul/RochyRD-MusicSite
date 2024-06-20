function Footer() {
  return (
    <footer className="flex flex-col gap-1  backdrop-blur-3xl pt-3 rounded-t-xl text-white">
      <p className="text-center text-black">
        By AlGhoul
      </p>

      <p className="text-center text-black">
        Copyright &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}

export default Footer;
