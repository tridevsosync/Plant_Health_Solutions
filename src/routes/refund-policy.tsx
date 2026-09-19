import { createFileRoute } from "@tanstack/react-router";
import { Prose } from "@/components/site/Section";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund & Return Policy — Plant Health Solutions" },
      { name: "description", content: "Damaged, leaking or wrongly delivered products can be returned within 7 days of delivery. Please share unboxing photographs along with the invoice num" },
      { property: "og:title", content: "Refund & Return Policy — Plant Health Solutions" },
      { property: "og:description", content: "Damaged, leaking or wrongly delivered products can be returned within 7 days of delivery. Please share unboxing photographs along with the invoice num" },
    ],
  }),
  component: Page,
});

const paragraphs = ['Damaged, leaking or wrongly delivered products can be returned within 7 days of delivery. Please share unboxing photographs along with the invoice number on WhatsApp or email.', 'Once the return is verified at our Tidagundi center, a replacement is dispatched or a refund is processed to the original payment method within 7 to 10 working days.', 'Opened or partially used packs of biological and liquid formulations cannot be returned for safety and quality reasons, unless a manufacturing defect is confirmed by our QC laboratory.', 'Cash on delivery orders are refunded by bank transfer after the bank details are shared and verified.'];

function Page() {
  return <Prose title="Refund & Return Policy" paragraphs={paragraphs} />;
}
