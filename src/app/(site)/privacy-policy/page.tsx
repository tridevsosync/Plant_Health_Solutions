import { Prose } from "@/components/site/Section";

const paragraphs = [
  "Plant Health Solutions Pvt. Ltd. respects the privacy of every farmer and customer who uses this website. This policy explains what information we collect and how it is used.",
  "We collect only the details you provide voluntarily — name, phone number, email address and delivery address — to process orders and provide agronomy advisory. Payment simulation on this site does not store any card or bank credentials.",
  "Order history, cart and wishlist information is stored locally in your browser so that your session is preserved between visits. We do not sell or rent your personal information to third parties.",
  "You may request correction or deletion of your data at any time by writing to planthealthsol@gmail.com or calling +91 91759 55009.",
];

export default function PrivacyPolicyPage() {
  return <Prose title="Privacy Policy" paragraphs={paragraphs} />;
}
