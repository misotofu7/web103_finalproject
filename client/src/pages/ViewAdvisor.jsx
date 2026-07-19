import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../css/ViewAdvisor.css";
import ReviewCard from "../components/ReviewCard";

const getDetails = async (id) => {
  return {
    name: "John Lee",
    school: "New York University",
    department: "Computer Science",
    email: "j.lee@nyu.edu",
    office: "1234 Washington Hall",
  };
};

const getReviews = async (id) => {
  return [
    {
      username: "jlkr32567",
      overall_rating: 3.8,
      communication_rating: 4.0,
      availability_rating: 3.5,
      comment: "Great advisor, very supportive and responsive to emails.",
      would_recommend: true,
      datetime_unix: "2026-07-18T23:22:00+00:00",
    },
    {
      username: "csStudent99",
      overall_rating: 4.2,
      communication_rating: 4.5,
      availability_rating: 4.0,
      comment: "Lee genuinely cares about student success.",
      would_recommend: true,
      datetime_unix: "2026-07-10T14:15:00+00:00",
    },
    {
      username: "alex_k2024",
      overall_rating: 3.5,
      communication_rating: 3.5,
      availability_rating: 3.0,
      comment: "Good advisor, but sometimes hard to reach during busy periods.",
      would_recommend: true,
      datetime_unix: "2026-06-25T08:45:00+00:00",
    },
  ];
};

const ViewAdvisor = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [rating, setRating] = useState(NaN);
  const [details, setDetails] = useState(null);
  const [reviews, setReviews] = useState([]);

  const fetchAdvisorDetails = async (id) => {
    try {
      setLoading(true);
      const details = await getDetails(id);

      // Advisor not found
      if (!details) {
        setNotFound(true);
        return;
      }

      const reviews = await getReviews(id);

      // No reviews
      if (reviews.length > 0) {
        const totalRating = reviews.reduce(
          (acc, review) => acc + review.overall_rating,
          0,
        );
        setRating((totalRating / reviews.length).toFixed(2));
      }

      setDetails(details || null);
      setReviews(reviews || []);
    } catch (err) {
      // Set error
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    (id) => {
      fetchAdvisorDetails();
    },
    [id],
  );

  if (loading) {
    return (
      <main className="container" style={{ textAlign: "center" }}>
        <p aria-busy="true">Loading...</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main
        className="container"
        style={{ textAlign: "center", padding: "2rem" }}
      >
        <h2>Advisor Not Found</h2>
        <p>
          Sorry, the advisor you are looking for does not exist or has been
          removed.
        </p>
        <Link to="/" className="button">
          Go Back Home
        </Link>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="summary">
        <div className="advisor-info">
          <h1>{details.name}</h1>
          <p className="department">{details.department}</p>
          <p className="school">{details.school}</p>
        </div>
        <div className="rating-card">
          <h3>{rating} / 5</h3>
        </div>
      </section>

      <section className="reviews">
        <h1>Reviews</h1>
        {reviews.map((review, index) => (
          <ReviewCard key={index}  review={review} />
        ))}
      </section>
    </main>
  );
};

export default ViewAdvisor;
