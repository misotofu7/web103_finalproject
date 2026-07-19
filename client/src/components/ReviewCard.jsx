import "../css/ReviewCard.css";

const RatingBar = ({ label, value }) => (
  <div className="rating-row">
    <div className="rating-top">
      <span>{label}</span>
      <span>{value}/5</span>
    </div>

    <div className="rating-bar">
      <div
        className="rating-fill"
        style={{ width: `${(value / 5) * 100}%` }}
      />
    </div>
  </div>
);

const ReviewCard = ({ review }) => {
  const {
    username,
    overall_rating,
    communication_rating,
    availability_rating,
    comment,
    would_recommend,
    datetime_unix,
  } = review;

  const formattedDate = new Date(datetime_unix).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="user-info">
          <span className="username">@{username}</span>
          <span className="review-date">{formattedDate}</span>
        </div>

        <div className="overall-rating">
          <span className="rating-num">{overall_rating}</span>
          <span className="rating-label"> / 5</span>
        </div>
      </div>

      <div className="sub-ratings">
        <RatingBar
          label="Communication"
          value={communication_rating}
        />
        <RatingBar
          label="Availability"
          value={availability_rating}
        />
      </div>

      <p className="review-comment">"{comment}"</p>

      <div className="review-footer">
        {would_recommend ? (
          <span className="recommend-tag yes">✓ Recommends Advisor</span>
        ) : (
          <span className="recommend-tag no">✗ Does Not Recommend</span>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
