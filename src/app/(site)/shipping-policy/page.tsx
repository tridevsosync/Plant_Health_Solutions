"use client";

import * as React from "react";
import { Prose } from "@/components/site/Section";
import { inr, useApp } from "@/lib/store";

export default function ShippingPolicyPage() {
  const { state } = useApp();
  const freeThreshold = state.settings.freeShippingThreshold ?? 2000;
  const flatFee = state.settings.shippingFee ?? 90;
  const facility = state.settings.facilityLocationTitle || "Tidagundi, Vijayapura";

  const paragraphs = [
    `Orders are dispatched from our ${facility} facility within 24 to 48 working hours of confirmation.`,
    "Delivery takes 2 to 4 working days within Karnataka and Maharashtra and 4 to 7 working days for the rest of India, depending on courier reach.",
    `Shipping is free on all orders above ${inr(freeThreshold)}. A standard flat charge of ${inr(flatFee)} applies to smaller orders. Bulk and dealer consignments are moved by surface transport with separate freight terms.`,
    "Tracking details are shared by SMS and WhatsApp once the consignment is handed over to the courier partner.",
  ];

  return <Prose title="Shipping Policy" paragraphs={paragraphs} />;
}
