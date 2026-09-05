import { COLORS } from "../constants";
import { FONT_STACK } from "./EmailLayout";

export type Field = { label: string; value: string };

// Editorial key/value presentation — each label is a small caption sitting
// above its value, stacked with whitespace instead of ruled lines.
export function FieldList({ fields }: { fields: Field[] }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
      <tbody>
        {fields.map((field, i) => (
          <tr key={field.label}>
            <td style={{ paddingBottom: i === fields.length - 1 ? 0 : 18, textAlign: "left" }}>
              <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        textAlign: "left",
                        fontFamily: FONT_STACK,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: COLORS.inkMuted,
                        paddingBottom: 4,
                      }}
                    >
                      {field.label}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        textAlign: "left",
                        fontFamily: FONT_STACK,
                        fontSize: 16,
                        fontWeight: 600,
                        lineHeight: "24px",
                        color: COLORS.ink,
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {field.value}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
