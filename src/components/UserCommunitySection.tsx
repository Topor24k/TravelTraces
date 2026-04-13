import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ChevronDown, Heart, MapPin, MessageCircle } from "lucide-react";

const FEATURED_PLACES = [
  { name: "Aliwagwag Falls", location: "Davao Oriental", image: "/images/Aliwagwag Falls.jpg" },
  { name: "El Nido Lagoon", location: "Palawan", image: "/images/El Nido Lagoons.jpg" },
  { name: "Enchanted River", location: "Surigao del Sur", image: "/images/Enchanted River.jpg" },
  { name: "Boracay", location: "Malay, Aklan", image: "/images/Boracay.jpg" },
  { name: "Chocolate Hills", location: "Bohol", image: "/images/Chocolate Hills.jpg" },
  { name: "Mayon Volcano", location: "Albay", image: "/images/Mayon Volcano.jpg" },
  { name: "Cloud 9", location: "Siargao", image: "/images/Cloud 9 Siargao.jpg" },
  { name: "Banaue Rice Terraces", location: "Ifugao", image: "/images/Banana Rice Terraces.jpg" },
];

const COMMUNITY_POSTS = [
  {
    id: 1,
    author: "Kayeen M. Campana",
    email: "kayeencampana@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=kayeen",
    placeName: "El Nido Lagoon",
    location: "Palawan",
    image: "/images/El Nido Lagoons.jpg",
    description:
      "The first time I arrived in El Nido, I immediately understood why people call it paradise. The moment I stepped out, I was greeted by towering limestone cliffs, clear water, and a calm atmosphere that felt unreal. Our island-hopping tour started early, and as the boat moved across the sea, every stop felt like a hidden world. The Big Lagoon was the part that stayed with me the most: the water shifted from deep blue to emerald green, and the sound of paddles echoing against the cliffs made everything feel quiet and sacred. I took my time kayaking deeper into the lagoon, and it felt like the whole place slowed down for a while. After that, we visited smaller beaches where the sand was soft, the water was warm, and local guides shared stories about the islands and their history. By sunset, the sky turned gold and orange over the cliffs, and I remember thinking that this was one of those travel moments you carry for years. El Nido did not feel like a simple destination; it felt like a place that reminded me to pause, observe, and appreciate how beautiful and peaceful nature can be when you let yourself experience it fully.",
    likes: 30,
    comments: 6,
  },
  {
    id: 2,
    author: "Kayeen M. Campana",
    email: "kayeencampana@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=kayeen-2",
    placeName: "Enchanted River",
    location: "Surigao del Sur",
    image: "/images/Enchanted River.jpg",
    description:
      "Nothing prepared me for the color of the Enchanted River in person. It looked lit from beneath, with deep blue tones that felt almost unreal, and the water was so clear that every movement seemed to glow under the sunlight. When I first stood near the edge, I could see shallow sections clearly, but the deeper parts faded into dark blue pockets that made the river feel mysterious and calm at the same time. I slowly stepped into the water and it was cooler than expected, refreshing after a hot day of travel. People around me were speaking softly, almost as if everyone understood this place deserved quiet respect. We spent time swimming, taking photos, and watching the fish feeding activity, and the whole experience felt less like a typical tourist stop and more like entering a natural sanctuary. Even after leaving the area, I kept thinking about how different the river felt from beaches and pools I had visited before. The Enchanted River is one of those places where the color, the silence, and the atmosphere combine into a memory that stays vivid long after the trip ends.",
    likes: 45,
    comments: 13,
  },
  {
    id: 3,
    author: "Kayeen M. Campana",
    email: "kayeencampana@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=kayeen-3",
    placeName: "Aliwagwag Falls",
    location: "Davao Oriental",
    image: "/images/Aliwagwag Falls.jpg",
    description:
      "Aliwagwag Falls looked like a giant staircase carved by nature the first moment I saw it. From a distance, the layered cascades seemed endless, and the sound of rushing water got louder with every step closer. The road trip through Davao Oriental was already beautiful, with green mountains, winding roads, and fresh air that made the long ride feel part of the adventure. When we reached the viewpoint, the scale of the falls became clear: tier after tier flowing into each other, each one reflecting sunlight differently. I spent time near the lower sections first, then walked around to see other angles, and every spot felt different in mood and sound. Some areas were loud and energetic while others felt calmer and more secluded. Local stories about the place made the visit even richer, because it gave context to how important the falls are to the community and to visitors who come for both nature and reflection. By the end of the day, I understood why people recommend Aliwagwag so strongly. It is not just one waterfall photo moment, but a full experience of movement, sound, and landscape that leaves a deep impression.",
    likes: 45,
    comments: 13,
  },
];

const TRAVEL_CATEGORIES = [
  {
    title: "Nature",
    items: ["Beaches", "Islands", "Falls / Waterfalls", "Mountains", "Hiking / Trails", "Forests / Jungles", "Rivers / Lakes", "Caves", "Volcanoes", "Hot & Cold Springs", "Spas", "Quiet Escapes"],
  },
  {
    title: "City Life",
    items: ["Cities / Downtown Areas", "Nightlife (bars, clubs)", "Rooftops / City Views", "Shopping Districts", "Street Markets"],
  },
  {
    title: "Food",
    items: ["Local Food Spots", "Street Food", "Cafés", "Restaurants", "Food Markets", "Food Trips / Culinary Tours"],
  },
  {
    title: "Culture",
    items: ["Museums", "Historical Landmarks", "Churches / Religious Sites", "Heritage Towns", "Monuments", "Festivals (very big in PH 🇵🇭)"],
  },
  {
    title: "Adventure",
    items: ["Snorkeling / Diving", "Surfing", "Ziplining", "ATV / Off-road", "Camping", "Island Hopping", "Trekking"],
  },
];

export const UserCommunitySection = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [expandedPostIds, setExpandedPostIds] = useState<number[]>([]);
  const [openCategoryTitle, setOpenCategoryTitle] = useState<string | null>(null);
  const categoriesRef = useRef<HTMLDivElement | null>(null);

  const maxStart = FEATURED_PLACES.length - 4;
  const visiblePlaces = FEATURED_PLACES.slice(startIndex, startIndex + 4);

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % (maxStart + 1));
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev - 1 + (maxStart + 1)) % (maxStart + 1));
  };

  const PREVIEW_CHAR_LIMIT = 760;

  const selectedPost = COMMUNITY_POSTS.find((post) => post.id === selectedPostId) ?? null;

  const openPostFromPlace = (placeName: string) => {
    const matchedPost = COMMUNITY_POSTS.find((post) => post.placeName === placeName);
    if (!matchedPost) return;
    setSelectedPostId(matchedPost.id);
  };

  const closePostModal = () => {
    setSelectedPostId(null);
  };

  const isExpanded = (postId: number) => expandedPostIds.includes(postId);

  const toggleExpanded = (postId: number) => {
    setExpandedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!categoriesRef.current?.contains(event.target as Node)) {
        setOpenCategoryTitle(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <section id="user-community" className="user-community-page-section">
      <div className="user-community-page-container">
        <div className="user-community-top-header">
          <div className="travel-post-categories-horizontal" ref={categoriesRef}>
            {TRAVEL_CATEGORIES.map((categoryGroup) => {
              const isOpen = openCategoryTitle === categoryGroup.title;

              return (
                <div key={categoryGroup.title} className="travel-post-category-menu">
                  <button
                    type="button"
                    className={`travel-post-category-pill ${isOpen ? "travel-post-category-pill-active" : ""}`}
                    aria-expanded={isOpen}
                    aria-controls={`travel-category-${categoryGroup.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    onClick={() => setOpenCategoryTitle(isOpen ? null : categoryGroup.title)}
                  >
                    {isOpen && (
                      <motion.span
                        layoutId="travel-category-active-pill"
                        className="travel-post-category-active-bg"
                        transition={{ type: "spring", stiffness: 420, damping: 35 }}
                      />
                    )}
                    <span className="travel-post-category-pill-label">{categoryGroup.title}</span>
                    <ChevronDown className={`travel-post-category-pill-icon ${isOpen ? "travel-post-category-pill-icon-open" : ""}`} />
                  </button>

                  {isOpen && (
                    <div
                      id={`travel-category-${categoryGroup.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className="travel-post-category-dropdown"
                    >
                      <ul className="travel-post-category-dropdown-list">
                        {categoryGroup.items.map((item) => (
                          <li key={item}>
                            <button
                              type="button"
                              className="travel-post-category-dropdown-item"
                              onClick={() => setOpenCategoryTitle(null)}
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <h2 className="featured-places-title user-community-page-title">Travel Post</h2>
          <p className="featured-places-description user-community-page-description">
            Discover traveler posts, featured places, and personal experiences from the TravelTraces community.
          </p>
        </div>

        <div className="community-top-places-slider">
          <button onClick={prevSlide} className="community-slider-nav-btn community-slider-prev-btn" aria-label="Previous places">
            <ChevronLeft className="community-slider-nav-icon" />
          </button>

          <div className="community-top-places-grid">
            <AnimatePresence mode="popLayout">
              {visiblePlaces.map((place) => (
                <motion.article
                  key={place.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ y: -15 }}
                  onClick={() => openPostFromPlace(place.name)}
                  className={`community-top-place-card group ${COMMUNITY_POSTS.some((post) => post.placeName === place.name) ? "community-top-place-card-clickable" : "community-top-place-card-static"}`}
                >
                  <img src={place.image} alt={place.name} className="community-top-place-image" referrerPolicy="no-referrer" />
                  <div className="community-top-place-overlay" />
                  <div className="community-top-place-info">
                    <h4 className="community-top-place-name">{place.name}</h4>
                    <p className="community-top-place-location">{place.location}</p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          <button onClick={nextSlide} className="community-slider-nav-btn community-slider-next-btn" aria-label="Next places">
            <ChevronRight className="community-slider-nav-icon" />
          </button>
        </div>

        <AnimatePresence>
          {selectedPost && (
            <motion.div
              className="user-community-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePostModal}
            >
              <motion.article
                className="user-community-post-card user-community-modal-card"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="user-community-post-header">
                  <div className="user-community-post-author-group">
                    <img src={selectedPost.avatar} alt={selectedPost.author} className="user-community-post-avatar" />
                    <div className="user-community-post-author-details">
                      <h3 className="user-community-post-author-name">{selectedPost.author}</h3>
                      <p className="user-community-post-author-email">{selectedPost.email}</p>
                    </div>
                  </div>
                  <button className="user-community-post-map-btn">View on Map</button>
                </div>

                <div className="user-community-post-body">
                  <div className="user-community-post-place-media">
                    <img src={selectedPost.image} alt={selectedPost.placeName} className="user-community-post-place-image" referrerPolicy="no-referrer" />
                    <div className="user-community-post-place-overlay" />
                    <div className="user-community-post-place-info">
                      <h4 className="user-community-post-place-name">{selectedPost.placeName}</h4>
                      <p className="user-community-post-place-location">{selectedPost.location}</p>
                    </div>
                  </div>

                  <div className="user-community-post-content-column">
                    <div className="user-community-post-description-wrapper">
                      <p className="user-community-post-description">
                        {isExpanded(selectedPost.id) || selectedPost.description.length <= PREVIEW_CHAR_LIMIT
                          ? selectedPost.description
                          : `${selectedPost.description.slice(0, PREVIEW_CHAR_LIMIT).trim()}...`}
                      </p>
                      {selectedPost.description.length > PREVIEW_CHAR_LIMIT && (
                        <button
                          type="button"
                          onClick={() => toggleExpanded(selectedPost.id)}
                          className="user-community-read-more-btn"
                        >
                          {isExpanded(selectedPost.id) ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </div>

                    <div className="user-community-post-engagement-row">
                      <button className="user-community-post-engagement-btn">
                        <Heart className="user-community-post-engagement-icon" />
                        <span>{selectedPost.likes}</span>
                      </button>
                      <button className="user-community-post-engagement-btn">
                        <MessageCircle className="user-community-post-engagement-icon" />
                        <span>{selectedPost.comments}</span>
                      </button>
                      <div className="user-community-post-location-chip">
                        <MapPin className="user-community-post-location-chip-icon" />
                        <span>{selectedPost.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};