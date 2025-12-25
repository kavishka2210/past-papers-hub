const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border bg-background py-6">
      <div className="container text-center">
        <p className="text-sm text-muted-foreground">
          © {currentYear} TechHub | A/L Past Papers Resource
        </p>
      </div>
    </footer>
  );
};

export default Footer;
