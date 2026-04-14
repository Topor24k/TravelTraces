import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ChevronDown, Heart, MapPin, MessageCircle } from "lucide-react";
import { communityFeedPosts, featuredPublicPlacePosts, getUserById } from "../data/mockDatabase";

const FEATURED_PLACES = featuredPublicPlacePosts.map((post) => ({
  id: post.id,
  name: post.placeName,
  location: post.location,
  image: post.image,
  ownerId: post.ownerId,
}));

const COMMUNITY_POSTS = communityFeedPosts;

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
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
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

  const isExpanded = (postId: string) => expandedPostIds.includes(postId);

  const toggleExpanded = (postId: string) => {
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
              {visiblePlaces.map((place) => {
                const owner = getUserById(place.ownerId);

                return (
                <motion.article
                  key={place.id}
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
                    <p className="font-life-savers text-xs opacity-80 mt-1">By {owner?.name ?? "Unknown Traveler"}</p>
                  </div>
                </motion.article>
              );})}
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
                {(() => {
                  const owner = getUserById(selectedPost.ownerId);

                  return (
                <div className="user-community-post-header">
                  <div className="user-community-post-author-group">
                    <img src={owner?.avatar ?? "https://i.pravatar.cc/150?u=unknown"} alt={owner?.name ?? "Traveler"} className="user-community-post-avatar" />
                    <div className="user-community-post-author-details">
                      <h3 className="user-community-post-author-name">{owner?.name ?? "Traveler"}</h3>
                      <p className="user-community-post-author-email">{owner?.email ?? "no-email@traveltraces.app"}</p>
                    </div>
                  </div>
                  <button className="user-community-post-map-btn">View on Map</button>
                </div>
                  );
                })()}

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