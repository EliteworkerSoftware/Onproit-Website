// A plain <Section style={{marginTop}}> puts that margin on the <table> tag
// itself, which some webmail clients ignore — an explicit empty row with a
// pixel height on the <td> is the bulletproof cross-client way to add
// vertical space in email HTML.
export function Spacer({ height }: { height: number }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td style={{ height, fontSize: 0, lineHeight: 0 }}>&nbsp;</td>
        </tr>
      </tbody>
    </table>
  );
}
