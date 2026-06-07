export function Footer({ dashboard = false }: { dashboard?: boolean }) {
  return (
    <footer className="footer" role="contentinfo" style={dashboard ? { borderTop: "2px solid #b1b4b6" } : undefined}>
      <div className="nhs-width">
        <div className="footer__top" style={dashboard ? { borderBottom: 0, display: "block" } : undefined}>
          <div className="footer__brand" style={dashboard ? { marginBottom: 18 } : undefined}>HandyAndy</div>
          <nav aria-label="Footer navigation">
            <a href="#accessibility">Accessibility{dashboard ? " statement" : ""}</a>
            <a href="#cookies">Cookies</a>
            <a href="#privacy">Privacy policy</a>
            <a href="#terms">Terms and conditions</a>
            <a href="#contact">Contact{dashboard ? " us" : ""}</a>
          </nav>
        </div>
        <p className="footer__copy">© {dashboard ? "NHS Digital" : "HandyAndy Healthcare. Part of the NHS digital ecosystem."}</p>
      </div>
    </footer>
  );
}
