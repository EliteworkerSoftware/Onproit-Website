import { Head, Html, Preview } from "@react-email/components";
import type { ReactNode } from "react";
import { COLORS } from "../constants";

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// Shared shell for every outbound email. The header and gradient stripe are
// full-bleed — they span the entire viewport edge-to-edge just like the real
// site's Navbar, unconstrained by any max-width. Only the text content below
// is capped to a comfortable reading width and centered within that band, so
// a wide desktop client doesn't get a header that stops short and looks boxed
// in. Ported from the EliteWorker site's proven table-based layout, which
// renders correctly on both desktop and mobile mail clients.
export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <body style={{ margin: 0, padding: 0, backgroundColor: COLORS.paper, fontFamily: FONT_STACK }}>
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ borderCollapse: "collapse", backgroundColor: COLORS.paper }}
        >
          <tbody>
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td align="center" style={{ backgroundColor: COLORS.nav, padding: "40px 40px" }}>
                        <span style={{ fontFamily: FONT_STACK, fontSize: 24, fontWeight: 800, letterSpacing: "-0.01em" }}>
                          <span style={{ color: "#ffffff" }}>ONPRO</span>{" "}
                          <span style={{ color: COLORS.brand }}>IT</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ height: 4, fontSize: 0, lineHeight: 0, backgroundColor: COLORS.brandDark }}>&nbsp;</td>
                    </tr>
                  </tbody>
                </table>

                <table
                  role="presentation"
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ borderCollapse: "collapse", maxWidth: 640, backgroundColor: COLORS.paper }}
                >
                  <tbody>
                    <tr>
                      <td style={{ padding: "48px 40px", textAlign: "center" }}>{children}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </Html>
  );
}

export { FONT_STACK };
