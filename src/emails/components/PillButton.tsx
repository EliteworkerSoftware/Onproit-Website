import { Button } from "@react-email/components";
import { COLORS } from "../constants";

export function PillButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: string;
  variant?: "primary" | "secondary";
}) {
  const style =
    variant === "primary"
      ? { backgroundColor: COLORS.accent, color: "#ffffff", border: "1px solid transparent" }
      : { backgroundColor: "transparent", color: COLORS.ink, border: `1px solid ${COLORS.line}` };

  return (
    <Button
      href={href}
      style={{
        ...style,
        fontSize: 14,
        fontWeight: 600,
        textDecoration: "none",
        padding: "12px 28px",
        borderRadius: 999,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Button>
  );
}
