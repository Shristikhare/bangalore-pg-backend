const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h3>PGBangalore</h3>
          <p>Find verified boys & girls PG accommodation across Bangalore — Koramangala, HSR Layout, Indiranagar, Electronic City & more.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>Boys PG</li>
            <li>Girls PG</li>
            <li>List Your PG</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h4>Popular Localities</h4>
          <ul>
            <li>Koramangala</li>
            <li>HSR Layout</li>
            <li>Indiranagar</li>
            <li>Electronic City</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} PGBangalore. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
