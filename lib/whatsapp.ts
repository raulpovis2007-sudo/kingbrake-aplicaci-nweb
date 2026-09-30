export const WHATSAPP_PHONE = "51908920221";

export function getWhatsAppUrl(message: string, phone = WHATSAPP_PHONE) {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}
