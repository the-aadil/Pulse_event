export type GalleryItem = {
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
};

function birthday(n: number, width: number, height: number): GalleryItem {
  return {
    src: `/images/gallery/birthdays/birthday-${String(n).padStart(2, "0")}.jpeg`,
    alt: `Birthday celebration moment ${n} captured by Pulse Event`,
    category: "Birthdays",
    width,
    height,
  };
}

const birthdayPhotos: GalleryItem[] = [
  birthday(1, 736, 981),
  birthday(2, 720, 815),
  birthday(3, 736, 483),
  birthday(4, 736, 757),
  birthday(5, 735, 655),
  birthday(6, 736, 736),
  birthday(7, 735, 808),
  birthday(8, 736, 981),
  birthday(9, 736, 981),
  birthday(10, 716, 904),
  birthday(11, 720, 720),
  birthday(12, 736, 552),
  birthday(13, 736, 736),
  birthday(14, 736, 981),
  birthday(15, 736, 552),
  birthday(16, 736, 517),
  birthday(17, 736, 981),
  birthday(18, 736, 736),
  birthday(19, 736, 924),
  birthday(20, 736, 552),
  birthday(21, 735, 975),
  birthday(22, 720, 909),
  birthday(23, 735, 854),
  birthday(24, 736, 953),
  birthday(25, 736, 920),
  birthday(26, 735, 887),
  birthday(27, 736, 736),
  birthday(28, 736, 736),
  birthday(29, 736, 920),
  birthday(30, 736, 981),
  birthday(31, 736, 981),
  birthday(32, 736, 552),
  birthday(33, 735, 549),
  birthday(34, 736, 552),
  birthday(35, 564, 423),
  birthday(36, 736, 736),
  birthday(37, 736, 552),
  birthday(38, 736, 736),
  birthday(39, 736, 981),
  birthday(40, 736, 736),
  birthday(41, 736, 705),
  birthday(42, 679, 679),
  birthday(43, 736, 552),
  birthday(44, 736, 552),
  birthday(45, 736, 552),
  birthday(46, 736, 736),
  birthday(47, 736, 981),
  birthday(48, 736, 657),
  birthday(49, 736, 736),
  birthday(50, 736, 698),
  birthday(51, 736, 920),
  birthday(52, 736, 920),
];

function wedding(n: number, width: number, height: number): GalleryItem {
  return {
    src: `/images/gallery/weddings/wedding-${String(n).padStart(2, "0")}.jpeg`,
    alt: `Wedding celebration moment ${n} captured by Pulse Event`,
    category: "Weddings",
    width,
    height,
  };
}

const weddingPhotos: GalleryItem[] = [
  wedding(1, 564, 705),
  wedding(2, 564, 752),
  wedding(3, 736, 723),
  wedding(4, 735, 490),
  wedding(5, 736, 1104),
  wedding(6, 736, 920),
  wedding(7, 1280, 575),
  wedding(8, 736, 1308),
  wedding(9, 4096, 3072),
  wedding(10, 2304, 4096),
  wedding(11, 736, 1308),
  wedding(12, 736, 981),
  wedding(13, 4096, 1836),
  wedding(14, 736, 981),
  wedding(15, 735, 490),
  wedding(16, 4096, 2304),
  wedding(17, 720, 1280),
  wedding(18, 4096, 2304),
  wedding(19, 736, 981),
  wedding(20, 1080, 1080),
  wedding(21, 1080, 718),
  wedding(22, 1080, 1056),
  wedding(23, 1080, 1080),
  wedding(24, 736, 893),
  wedding(25, 1080, 720),
  wedding(26, 668, 445),
  wedding(27, 736, 736),
  wedding(28, 736, 552),
  wedding(29, 736, 981),
  wedding(30, 736, 736),
  wedding(31, 736, 792),
  wedding(32, 736, 736),
];

function game(n: number, width: number, height: number): GalleryItem {
  return {
    src: `/images/gallery/games/game-${String(n).padStart(2, "0")}.jpeg`,
    alt: `Game activity moment ${n} captured by Pulse Event`,
    category: "Games",
    width,
    height,
  };
}

const gamesPhotos: GalleryItem[] = [
  game(1, 800, 800),
  game(2, 800, 800),
  game(3, 800, 800),
  game(4, 800, 800),
  game(5, 800, 800),
  game(6, 800, 800),
  game(7, 800, 800),
  game(8, 800, 800),
  game(9, 800, 800),
  game(10, 800, 800),
  game(11, 800, 800),
  game(12, 800, 800),
  game(13, 800, 800),
  game(14, 800, 800),
  game(15, 800, 800),
  game(16, 800, 800),
  game(17, 800, 800),
  game(18, 800, 800),
  game(19, 800, 800),
  game(20, 800, 800),
  game(21, 800, 800),
  game(22, 800, 800),
  game(23, 800, 800),
  game(24, 800, 800),
];

export const galleryItems: GalleryItem[] = [...birthdayPhotos, ...weddingPhotos, ...gamesPhotos];

export const PAGE_SIZE = 9;

export const galleryCategories = [
  "Birthdays",
  "Weddings",
  "Games",
  "Theme Nights",
  "Fun Fairs",
  "Baby Showers",
  "Corporate",
  "Activities",
  "Catering",
];

export const CATEGORY_TO_SLUG: Record<string, string> = {
  Birthdays: "birthday-party",
  Weddings: "wedding-ceremony",
  Games: "games",
  "Theme Nights": "bollywood-theme",
  "Fun Fairs": "carnival-theme",
  "Baby Showers": "baby-shower",
  Corporate: "corporate-events",
  Activities: "games-activities",
  Catering: "catering-services",
};
