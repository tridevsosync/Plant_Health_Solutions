import { createFileRoute } from "@tanstack/react-router";
import { Prose } from "@/components/site/Section";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — Plant Health Solutions" },
      { name: "description", content: "Orders are dispatched from our Tidagundi, Vijayapura facility within 24 to 48 working hours of confirmation." },
      { property: "og:title", content: "Shipping Policy — Plant Health Solutions" },
      { property: "og:description", content: "Orders are dispatched from our Tidagundi, Vijayapura facility within 24 to 48 working hours of confirmation." },
    ],
  }),
  component: Page,
});

const paragraphs = ['Orders are dispatched from our Tidagundi, Vijayapura facility within 24 to 48 working hours of confirmation.', 'Delivery takes 2 to 4 working days within Karnataka and Maharashtra and 4 to 7 working days for the rest of India, depending on courier reach.', 'Shipping is free on all orders above Rs. 2,000. A flat charge of Rs. 90 applies to smaller orders. Bulk and dealer consignments are moved by surface transport with separate freight terms.', 'Tracking details are shared by SMS and WhatsApp once the consignment is handed over to the courier partner.'];

function Page() {
  return <Prose title="Shipping Policy" paragraphs={paragraphs} />;
}
