import {
  fetchContactInformation,
  fetchDirections,
  fetchServices,
  fetchSocials,
} from "@/actions/ui/main.controller";
import Header from "./Header";
import { CustomLocales, DirectionsType, IContactInformation, ServicesType, Social } from "@/services/interface/type";

export default async function HeaderServer({
  locale,
}: {
  locale: CustomLocales;
}) {
  const contactInfo = await fetchContactInformation(locale);
  const socials = await fetchSocials();
  const directions = await fetchDirections({ pageNumber: 1, locale });
  const services = await fetchServices({ pageNumber: 1, locale });
  return (
    <Header
      contactInfo={contactInfo as unknown as IContactInformation}
      socials={socials as unknown as Social[]}
      directions={directions.data as unknown as DirectionsType[]}
      services={services.data as unknown as ServicesType[]}
    />
  );
}
