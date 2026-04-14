export interface AppUser {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar: string;
}

export interface PlacePost {
  id: string;
  title: string;
  placeName: string;
  location: string;
  region: "Luzon" | "Visayas" | "Mindanao";
  image: string;
  date: string;
  ownerId: string;
  likes: number;
  comments: number;
  description: string;
}

export interface TravelerPostcard {
  id: string;
  image: string;
  caption: string;
  placeName: string;
  ownerId: string;
  rotation: string;
}

export const appUsers: AppUser[] = [
  {
    id: "u-kayeen",
    name: "Kayeen M. Campana",
    email: "kayeencampana@gmail.com",
    handle: "@kayeen",
    avatar: "https://i.pravatar.cc/150?u=kayeen",
  },
  {
    id: "u-mika",
    name: "Mika Dela Cruz",
    email: "mika.delacruz@gmail.com",
    handle: "@island_soul",
    avatar: "https://i.pravatar.cc/150?u=mika",
  },
  {
    id: "u-ken",
    name: "Ken Ramos",
    email: "kenramos@gmail.com",
    handle: "@blue_voyager",
    avatar: "https://i.pravatar.cc/150?u=ken",
  },
  {
    id: "u-sara",
    name: "Sara Villanueva",
    email: "sara.villanueva@gmail.com",
    handle: "@trail_journal",
    avatar: "https://i.pravatar.cc/150?u=sara",
  },
];

export const currentUserId = "u-kayeen";

export const placePosts: PlacePost[] = [
  {
    id: "post-el-nido",
    title: "El Nido Lagoon Journal",
    placeName: "El Nido Lagoon",
    location: "Palawan",
    region: "Luzon",
    image: "/images/El Nido Lagoons.jpg",
    date: "Apr 02, 2026",
    ownerId: "u-kayeen",
    likes: 30,
    comments: 6,
    description:
      "The first time I arrived in El Nido, I immediately understood why people call it paradise. The moment I stepped out, I was greeted by towering limestone cliffs, clear water, and a calm atmosphere that felt unreal. Our island-hopping tour started early, and as the boat moved across the sea, every stop felt like a hidden world. The Big Lagoon was the part that stayed with me the most: the water shifted from deep blue to emerald green, and the sound of paddles echoing against the cliffs made everything feel quiet and sacred. I took my time kayaking deeper into the lagoon, and it felt like the whole place slowed down for a while.",
  },
  {
    id: "post-aliwagwag",
    title: "Aliwagwag Falls Climb",
    placeName: "Aliwagwag Falls",
    location: "Davao Oriental",
    region: "Mindanao",
    image: "/images/Aliwagwag Falls.jpg",
    date: "Mar 18, 2026",
    ownerId: "u-sara",
    likes: 45,
    comments: 13,
    description:
      "Aliwagwag Falls looked like a giant staircase carved by nature the first moment I saw it. From a distance, the layered cascades seemed endless, and the sound of rushing water got louder with every step closer. The road trip through Davao Oriental was already beautiful, with green mountains, winding roads, and fresh air that made the long ride feel part of the adventure.",
  },
  {
    id: "post-enchanted-river",
    title: "Enchanted River Memory",
    placeName: "Enchanted River",
    location: "Surigao del Sur",
    region: "Mindanao",
    image: "/images/Enchanted River.jpg",
    date: "Feb 26, 2026",
    ownerId: "u-ken",
    likes: 45,
    comments: 13,
    description:
      "Nothing prepared me for the color of the Enchanted River in person. It looked lit from beneath, with deep blue tones that felt almost unreal, and the water was so clear that every movement seemed to glow under the sunlight. We spent time swimming, taking photos, and watching the fish feeding activity.",
  },
  {
    id: "post-boracay",
    title: "Boracay Daylight Story",
    placeName: "Boracay",
    location: "Malay, Aklan",
    region: "Visayas",
    image: "/images/Boracay.jpg",
    date: "Jan 22, 2026",
    ownerId: "u-mika",
    likes: 52,
    comments: 9,
    description:
      "Morning walks on White Beach and sunset sessions by the shore made this trip unforgettable. The best part was seeing the island switch from calm mornings to vibrant evenings in a single day.",
  },
  {
    id: "post-chocolate-hills",
    title: "Bohol Adventure",
    placeName: "Chocolate Hills",
    location: "Bohol",
    region: "Visayas",
    image: "/images/Chocolate Hills.jpg",
    date: "Mar 05, 2026",
    ownerId: "u-kayeen",
    likes: 18,
    comments: 3,
    description:
      "Bohol felt both peaceful and dramatic at the same time. The layered hills under changing sunlight gave every viewpoint a different mood.",
  },
  {
    id: "post-cloud9",
    title: "My Siargao Trip",
    placeName: "Cloud 9",
    location: "General Luna",
    region: "Mindanao",
    image: "/images/Cloud 9 Siargao.jpg",
    date: "Jan 12, 2026",
    ownerId: "u-kayeen",
    likes: 23,
    comments: 5,
    description:
      "Cloud 9 gave me the kind of sunrise that makes you stay quiet for a while. Great surf, relaxed streets, and amazing local cafes.",
  },
  {
    id: "post-mayon",
    title: "Mayon View Trail",
    placeName: "Mayon Volcano",
    location: "Albay",
    region: "Luzon",
    image: "/images/Mayon Volcano.jpg",
    date: "Mar 29, 2026",
    ownerId: "u-sara",
    likes: 39,
    comments: 8,
    description:
      "Mayon is even more striking in person. Every turn in Albay seems to frame the volcano in a new way.",
  },
  {
    id: "post-banaue",
    title: "Banaue Weekend",
    placeName: "Banaue Rice Terraces",
    location: "Ifugao",
    region: "Luzon",
    image: "/images/Banana Rice Terraces.jpg",
    date: "Apr 07, 2026",
    ownerId: "u-ken",
    likes: 27,
    comments: 4,
    description:
      "The terraces are massive and full of history. It felt like walking through a living landscape.",
  },
];

export const travelerPostcards: TravelerPostcard[] = [
  {
    id: "card-siargao",
    image: "/images/Cloud 9 Siargao.jpg",
    caption: "Sunset at Siargao. Pure magic.",
    placeName: "Cloud 9",
    ownerId: "u-mika",
    rotation: "-3deg",
  },
  {
    id: "card-boracay",
    image: "/images/Boracay.jpg",
    caption: "Boracay's white sand is unbeatable.",
    placeName: "Boracay",
    ownerId: "u-ken",
    rotation: "2deg",
  },
  {
    id: "card-bohol",
    image: "/images/Chocolate Hills.jpg",
    caption: "Chocolate Hills or giant truffles?",
    placeName: "Chocolate Hills",
    ownerId: "u-kayeen",
    rotation: "-1deg",
  },
  {
    id: "card-elnido",
    image: "/images/El Nido Lagoons.jpg",
    caption: "Crystal clear waters of El Nido.",
    placeName: "El Nido Lagoon",
    ownerId: "u-sara",
    rotation: "4deg",
  },
];

export const getUserById = (userId: string) => appUsers.find((user) => user.id === userId);

export const currentUserPlacePosts = placePosts.filter((post) => post.ownerId === currentUserId);

export const featuredPublicPlacePosts = placePosts
  .filter((post) => post.ownerId !== currentUserId)
  .slice(0, 8);

export const communityFeedPosts = placePosts
  .filter((post) => post.ownerId !== currentUserId)
  .slice(0, 6);
