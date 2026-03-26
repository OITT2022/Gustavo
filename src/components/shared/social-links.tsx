import { Instagram, Facebook, Youtube } from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/valenzuela_arts_/", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/valenzuelarts", label: "Facebook" },
  { icon: Youtube, href: "https://www.youtube.com/@gustavobarvalenzuela6440", label: "YouTube" },
];

export function SocialLinks() {
  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="text-gallery-400 transition-colors hover:text-gallery-700"
          >
            <Icon size={20} />
          </a>
        );
      })}
    </div>
  );
}
