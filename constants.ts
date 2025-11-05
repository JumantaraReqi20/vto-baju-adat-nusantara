import type { ClothingItem } from './types';

export const clothingItems: ClothingItem[] = [
  {
    id: 'dayak',
    name: 'Baju Adat Dayak',
    origin: 'Kalimantan',
    description: 'Pakaian adat Suku Dayak, kaya akan motif alam dan manik-manik yang melambangkan status dan keberanian.',
    imageUrl: 'https://i.ibb.co/L5hY5sD/wastra-dayak.png',
    coordinates: { lat: -0.5, lng: 114.0 },
  },
  {
    id: 'minangkabau',
    name: 'Bundo Kanduang',
    origin: 'Sumatera Barat',
    description: 'Pakaian adat Minangkabau yang megah, melambangkan peran penting perempuan dalam adat matrilineal.',
    imageUrl: 'https://i.ibb.co/xL3kX4R/wastra-minang.png',
    coordinates: { lat: -0.94, lng: 100.36 },
  },
  {
    id: 'bugis',
    name: 'Baju Bodo',
    origin: 'Sulawesi Selatan',
    description: 'Salah satu busana tertua di dunia, Baju Bodo dari Suku Bugis-Makassar memiliki warna yang menandakan usia dan status.',
    imageUrl: 'https://i.ibb.co/pP3wY9w/wastra-bugis.png',
    coordinates: { lat: -4.5, lng: 120.0 },
  },
  {
    id: 'bali',
    name: 'Payas Agung',
    origin: 'Bali',
    description: 'Busana adat Bali yang mewah dan agung, biasanya dikenakan saat upacara pernikahan atau potong gigi.',
    imageUrl: 'https://i.ibb.co/b343H7Z/wastra-bali.png',
    coordinates: { lat: -8.4, lng: 115.18 },
  },
  {
    id: 'batak',
    name: 'Ulos Batak',
    origin: 'Sumatera Utara',
    description: 'Kain tenun Ulos yang menjadi simbol restu, kasih sayang, dan persatuan dalam masyarakat Batak.',
    imageUrl: 'https://i.ibb.co/3s68KzY/wastra-batak.png',
    coordinates: { lat: 2.5, lng: 99.0 },
  },
];