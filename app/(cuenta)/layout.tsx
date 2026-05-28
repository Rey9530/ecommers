import { AccountShell } from "@/components/account/account-shell";

export default function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountShell>{children}</AccountShell>;
}
