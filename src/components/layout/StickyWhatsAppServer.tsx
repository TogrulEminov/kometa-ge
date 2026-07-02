import { fetchContactInformation } from "@/actions/ui/main.controller";
import { CustomLocales } from "@/services/interface/type";
import StickyWhatsApp from "./StickyWhatsApp";

export default async function StickyWhatsAppServer() {
  return <StickyWhatsApp />;
}
