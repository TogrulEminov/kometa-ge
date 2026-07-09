import { CustomLocales } from "@/services/interface/type";
import StickyWhatsApp from "./StickyWhatsApp";
import { fetchContactInformation } from "@/actions/ui/main.controller";

export default async function StickyWhatsAppServer({
  locale,
}: {
  locale: CustomLocales;
}) {
  const contactInfo = await fetchContactInformation(locale);

  return <StickyWhatsApp whatsapp={contactInfo?.whatsapp} />;
}
