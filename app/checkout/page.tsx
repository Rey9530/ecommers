import type { Metadata } from "next";

import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-6 font-display text-3xl font-semibold">
        Finalizar compra
      </h1>
      <CheckoutFlow />
    </div>
  );
}
