import { Social, SocialMediaKey } from "@/services/interface/type";
import StickyWhatsApp from "./StickyWhatsApp";
import { fetchSocialsByKey } from "@/actions/ui/main.controller";

export default async function StickyWhatsAppServer() {
  const whatsapp = await fetchSocialsByKey({ key: SocialMediaKey.whatsapp });
  return <StickyWhatsApp whatsapp={whatsapp as Social} />;
}
