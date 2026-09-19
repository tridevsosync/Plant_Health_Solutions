import { Prose } from "@/components/site/Section";

const paragraphs = [
  "Damaged, leaking or wrongly delivered products can be returned within 7 days of delivery. Please share unboxing photographs along with the invoice number on WhatsApp or email.",
  "Once the return is verified at our Tidagundi center, a replacement is dispatched or a refund is processed to the original payment method within 7 to 10 working days.",
  "Opened or partially used packs of biological and liquid formulations cannot be returned for safety and quality reasons, unless a manufacturing defect is confirmed by our QC laboratory.",
  "Cash on delivery orders are refunded by bank transfer after the bank details are shared and verified.",
];

export default function RefundPolicyPage() {
  return <Prose title="Refund & Return Policy" paragraphs={paragraphs} />;
}
