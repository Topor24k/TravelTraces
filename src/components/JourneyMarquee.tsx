export const JourneyMarquee = () => {
  const categories = ["Nature", "City Life", "Food", "Culture", "Adventure"];
  const repeatedCategories = Array.from({ length: 4 }, () => categories).flat();

  return (
    <div className="marquee-wrap" aria-label="Travel categories">
      <div className="marquee-track">
        <div className="marquee-group" aria-hidden="true">
          {repeatedCategories.map((category, index) => (
            <span key={`group-a-${category}-${index}`} className="marquee-item">
              {category}
            </span>
          ))}
        </div>
        <div className="marquee-group" aria-hidden="true">
          {repeatedCategories.map((category, index) => (
            <span key={`group-b-${category}-${index}`} className="marquee-item">
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
