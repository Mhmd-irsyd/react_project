import { ShoppingBagIcon, UserGroupIcon, StarIcon, GlobeAltIcon } from "@heroicons/react/24/solid";

export const stats = [
  {
    id: 1,
    icon: <ShoppingBagIcon className="w-10 h-10 text-blue-500" />,
    value: "10,000+",
    label: "Produk Terjual",
  },
  {
    id: 2,
    icon: <UserGroupIcon className="w-10 h-10 text-green-500" />,
    value: "5,000+",
    label: "Pelanggan Puas",
  },
  {
    id: 3,
    icon: <StarIcon className="w-10 h-10 text-yellow-500" />,
    value: "4.9/5",
    label: "Rating Kepuasan",
  },
  {
    id: 4,
    icon: <GlobeAltIcon className="w-10 h-10 text-purple-500" />,
    value: "Seluruh Indonesia",
    label: "Jangkauan Pengiriman",
  },
];
