import { Prose } from "@/components/site/Section";

const paragraphs = [
  "By accessing this website you agree to these terms. All product information, dosages and crop advisory published here are recommendations based on our field trials and should be adapted to local soil and weather conditions.",
  "Prices, offers and stock availability may change without prior notice. Orders are confirmed only after our team verifies the delivery address and product availability.",
  "Product performance depends on correct dosage, timing, soil condition, irrigation and weather. Plant Health Solutions Pvt. Ltd. is not liable for losses arising from misuse or application outside the recommended schedule.",
  "All content, images, formulations and trademarks on this site belong to Plant Health Solutions Pvt. Ltd. and may not be reproduced without written permission.",
];

export default function TermsPage() {
  return <Prose title="Terms & Conditions" paragraphs={paragraphs} />;
}
